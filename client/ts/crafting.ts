import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js';
import { unique, getKey } from '../../libs/utils.mjs';
import spinner from '../images/rings.svg';
import empty from '../images/empty.png';
import undefined_image from '../images/undefined.png';
import JSZip from 'jszip'


const global = window.global = {images:new Map(),selector:null,recipes:{},masterList:{}}

class AnimationController implements ReactiveController {
  private host: ReactiveControllerHost;
  delay: number
  enabled: bool
  url: string = spinner
  tagPosition: number = 0
  tagHash: string
  tagImages: string[]
  updating: boolean

  async hostConnected(){
    this.updating = true
    this.tagPosition = 0
    console.log('tag attach')
    delete this.tagImages
    this.tagImages = []
    if(this.host.type=='tag'){
      await this.updateTags()
    }
    this.updating = false
    this.enabled = true
  }

  hostDisconnected(){
    this.enabled = false
    this.tagHash = null
    console.log('tag dettach')
  }

  async validateTags(){
    if(this.updating){
      return
    }
    this.updating = true
    if(!this.hash){
      await this.updateTags()
      this.updating = false
      return
    }
    const encoder = new TextEncoder();
    const tags = chainTags('#'+this.host.elementid).flat().join(',')
    const data = encoder.encode(tags)
    const hash = await crypto.subtle.digest("SHA-256", data)
    if(this.hash==hash){
      return
    }
    await this.updateTags()
    this.updating = false
    return
  }

  async updateTags(){
    const tags = chainTags('#'+this.host.elementid).flat()
    this.url= spinner
    const images = tags.map(tag=>{
      if(global.images.has(tag)){
        return URL.createObjectURL(global.images.get(tag))
      }else{
        return undefined_image
      }
    })
    const encoder = new TextEncoder();
    const data = encoder.encode(tags.join(','))
    const hash = await crypto.subtle.digest("SHA-256", data)
    this.hash = hash
    this.tagImages = images
  }

  hostUpdate(){
    if(this.enabled){
      if(this.host.type=="item"){
        if(this.host.elementid.split(":")[0]=='special'){
          console.log(this.host.elementid)
          if(this.host.elementid.split(":")[1]=='empty'){
            this.url = empty
          }else if(this.host.elementid.split(":")[1]=='loading'){
            this.url = spinner
          }else{
            this.url = undefined_image
          }
        }else if(global.images.has(this.host.elementid)){
          this.url= URL.createObjectURL(global.images.get(this.host.elementid))
        }else{
          this.url= undefined_image
        }
      }else if(this.host.type=="tag"){
        if(!this.updating){
          if(this.tagPosition>=this.tagImages.length){
            this.tagPosition=0
          }
          if(this.tagImages.length>0){
            this.url = this.tagImages[this.tagPosition]
          }
          setTimeout(async (host)=>{
            await this.validateTags()
            this.tagPosition++
            this.host.requestUpdate();
          },1000,this)
        }else{
          this.url= undefined_image
          this.host.requestUpdate();
        }
      }
    }
  }

  constructor(host: ReactiveControllerHost, delay: number){
    this.host = host
    this.delay = delay
    this.enabled = false 
    host.addController(this)
  }
}

@customElement('item-display')
export class ItemDisplay extends LitElement {
  static styles = css`
    img { 
      height:64;
      width:64;
      padding: 10px;
      background: lightgrey;
    }
    span {
      display:flex;
      flex-direction: column;
      width: 80px;
      align-items: center;
      margin: 5px;
      border: 2px solid black;
      padding: 13px;
      height: 120px;
    }
    h5 {
      text-align: center;
      margin: 0;
      width: 100%;
      overflow: hidden;
      overflow-wrap: break-word;
      font-size: 10px;
    }
    .selected {
      background: yellow;
    }
  `;

  @property()
  elementid = 'special:loading';

  @property()
  selected = false;

  @property()
  type: string = 'item';

  private image = new AnimationController(this,1);

  itemModel(e){

  }

  render() {
    const classes = {selected: this.selected=="true"}
    let id = "special undefined"
    if(this.elementid){
      id = this.elementid.split(':').join(' ')
    }
    return html`<span class=${classMap(classes)}><img height="128" width="128" @click="${this.itemModel}" src="${this.image.url}"><h5>${id}</h5></span>`;
  }
}

@customElement('item-slot')
export class ItemSlot extends ItemDisplay {
  itemModel(e){
    if(global.selector){
      global.selector.target = this
      global.selector.openDialog = true
      global.selector.selected = this.elementid
    }
  }
  changeItem(e){
    const event = new Event('change', {bubbles: true, composed: rue});
    this.dispatchEvent(event)
  }
}

@customElement('shaped-crafting')
export class ShapedCrafting extends LitElement {
  static styles = css`
    .row { 
      display: flex;
      flex-direction: row; 
      padding-bottom: 1% 
    } 
    .grid { 
      display: flex; 
      flex-direction: column
    } 
    .gap {
      width: 40px;
    }
    item-slot { 
      padding-right: 1%
    }
    button {
      width: fit-content;
    }
  `;

  @property()
  result = 'empty';

  @property()
  recipeId = "";

  @property()
  recipeName = "";

  generateRecipe(){
    const grid = this.shadowRoot.querySelector('.grid')
    const items = Array.from(grid.querySelectorAll('item-slot'))
    const output = items.map(x=>x.type+"^"+x.elementid)
    const result = output.splice(6,1)[0]
    const usedItems = unique(output)
    const letters = "ABCDEFGHI"
    let processedKey = {}
    let reverseKey = {}
    usedItems.forEach((item,pos)=>{
      const type = item.split('^')[0]
      const id = item.split('^')[1]
      if(id == "special:empty"){
        return
      }
      processedKey[letters[pos]]={}
      if(type=='item'){
        processedKey[letters[pos]].item=id
      }
      if(type=='tag'){
        processedKey[letters[pos]].tag=id
      }
      reverseKey[item]=letters[pos]
    })

    const processedPattern = output.map(item=>{
      const type = item.split('^')[0]
      const id = item.split('^')[1]
      if(id=="special:empty"){
        return " "
      }else{
        return reverseKey[item]
      }
    })
    const mergedPattern = processedPattern.join('')
    const trimmedPattern = mergedPattern.match(/.{1,3}/g)
    let largestLength = trimmedPattern.reduce((x,y)=>y.trim().length > x ? y.trim().length: x,0)
    console.log(largestLength)
    console.log(trimmedPattern)
    const cleanedPattern = trimmedPattern.map(x=>x.substr(0,largestLength)).filter(x=>x.trim().length>0)
    console.log(cleanedPattern)
    const finishedRecipe = {
      type:"minecraft:crafting_shaped",
      result:{
        item: result.split('^')[1],
      },
      pattern: cleanedPattern,
      key: processedKey,
    }
    console.log(finishedRecipe)
    return finishedRecipe
  }

  saveRecipe(){
    const namespace = this.shadowRoot.querySelector('#namespace').value 
    const id = this.shadowRoot.querySelector('#id').value
    const newName = namespace+":"+id
    if(newName != this.recipeName){
      delete global.recipes[namespace][id]
    }
    global.recipes[namespace][id]=this.generateRecipe()
  }

  importRecipe(recipe,name){
    const grid = this.shadowRoot.querySelector('.grid');
    const items = Array.from(grid.querySelectorAll('item-slot'));
    let pattern = recipe.pattern.map(x=>{
      let fix = x.split('')
      while(fix.length<3){
        fix.push(' ')
      }
      return fix.join('')
    }).map(x=>x.split('')).flat()
    while(pattern.length<9){
      pattern.push(' ')
    }
    pattern = pattern.map(x=>{
      if(x==" "){
        return {type:"item",value:"special:empty"}
      }else{
        if(recipe.key[x].item){
          return {type:'item',value:recipe.key[x].item}
        }else if(recipe.key[x].tag){
          return {type:'tag',value:recipe.key[x].tag}
        }else{
          return {type:'item',value:"special:undefined"}
        }
      }
    })
    pattern.splice(6,0,{type:'item',value:recipe.result.item})
    pattern.forEach((item,slot)=>{
      items[slot].type=item.type
      items[slot].elementid=item.value
    })
    this.recipeName = name
    this.shadowRoot.querySelector('#namespace').value = name.split(":")[0]
    this.shadowRoot.querySelector('#id').value = name.split(":")[1]
  }

  async clearGrid(){
    const grid = this.shadowRoot.querySelector('.grid')
    const items = Array.from(grid.querySelectorAll('item-slot'))
    console.log(items)
    items.forEach(item=>{
      item.elementid = "special:loading"
    })
  }

  itemChanged(e){

  }

  render() {

    return html`
      <div class="grid">
        <input type='text' id='namespace' placeholder="Namespace"/><input type='text' id='id' placeholder="Recipe ID"/>
        <div class="row">${map(range(0,3), (e)=>html`<item-slot elementid="" @change="${this.itemChanged}"/>`)}</div>
        <div class="row">${map(range(3,6), (e)=>html`<item-slot elementid="" @change="${this.itemChanged}"/>`)}<div class="gap"></div><item-slot elementid="" @change="${this.itemChanged}"/></div>
        <div class="row">${map(range(6,9), (e)=>html`<item-slot elementid="" @change="${this.itemChanged}"/>`)}</div>
        <button @click="${this.saveRecipe}">Save</button>
      </div>
    `
  }
}

@customElement('item-selector')
export class ItemSelector extends LitElement {
  static styles = css`
    h1 {
      margin: 0;
      padding: 16px;
      background-color: RGBA(200,200,200,255);
    }
    dialog {
      padding: 0;
    }
    .item-group {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  `

  @state()
  openDialog = false

  @property()
  items = {special:["empty"]}

  @property()
  tags = {}

  @property()
  selectedItem = null
  @property()
  selectedTag = null

  open(){
    this.openDialog = true
  }

  target = null

  select(e){
    if(this.target){
      this.target.elementid = e.target.elementid
      this.target.type = e.target.type
      this.target=null
    }
    this.openDialog=false
  }
  render(){
    console.log(this.tags)
    return html`
      <dialog ?open=${this.openDialog}>
        <h1>Item Selector</h1>
        <div id="itemList">
          ${map(Object.keys(this.items),(name)=> {
            const itemList = this.items[name]
            return html`<div>
              <h3>${name}</h3>
                <div class="item-group">
                ${map(itemList,(item)=> html`<item-display selected=${(this.selected == name+":"+item)} @click="${this.select}" type="item" elementid="${name}:${item}"></item-display>`)}
                </div>
              </div>`
          })}
        </div>
        <h1>Tag Selector</h1>
        <div id="tagList">
          ${map(Object.keys(this.tags),(name)=> {
            const itemList = this.tags[name]
            console.log(itemList)
            return html`<div>
              <h3>${name}</h3>
                <div class="item-group">
                ${map(itemList,(item)=> html`<item-display selected=${(this.selected == name+":"+item)} @click="${this.select}" type="tag" elementid="${name}:${item}"></item-display>`)}
                </div>
              </div>`
          })}
        </div>
      </dialog>
    `
  }
}

const generateDataPack = async () => {
  const packZip = new JSZip()
  const mcmeta = JSON.stringify({
    pack: {
      pack_format: 8,
      description: "Generated from Kobold Constructor Fleet"
    }
  })
  packZip.file("pack.mcmeta",mcmeta)
  packZip.folder('data')
  Object.keys(global.recipes).forEach(namespace=>{
    const recipes = global.recipes[namespace]
    packZip.folder(`data/${namespace}`)
    packZip.folder(`data/${namespace}/recipes`)
    Object.keys(recipes).forEach(id=>{
      const recipeFile = JSON.stringify(recipes[id])
      packZip.file(`data/${namespace}/recipes/${id}.json`,recipeFile)
    })
  })
  const packBlob = await packZip.generateAsync({type: 'blob'})
  const link = URL.createObjectURL(packBlob);
  const a = document.createElement('a');
  a.download = "pack.zip"
  a.href = link
  a.click()
  URL.revokeObjectURL(link)
}

const generateItemSelector = ()=>{
  global.selector = new ItemSelector()
  global.selector.items = global.masterList.items
  global.selector.tags = {}
  Object.keys(global.masterList.tags).forEach(namespace=>{
    global.selector.tags[namespace]=Object.keys(global.masterList.tags[namespace])
  })
  console.log(global.selector.tags)
  document.body.prepend(global.selector)
}

const insertUploadButton = () => {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.addEventListener('change', (e)=>{
    loadPackage(e.target.files[0])
  },false);
  document.body.appendChild(inputElement);
}

const insertExportButton = () => {
  const buttonElement = document.createElement('button')
  buttonElement.textContent="Download pack.zip"
  buttonElement.addEventListener('click', (e)=>{
    generateDataPack()
    /*
    const recipes = JSON.stringify(global.recipes)
    console.log(recipes)
    const toDownload = new Blob([recipes],{type:'data:application/json'});
    console.log(toDownload)
    const link = URL.createObjectURL(toDownload);
    const a = document.createElement('a');
    a.download = "recipes.json"
    a.href = link
    a.click()
    URL.revokeObjectURL(link)
    */
  },false)
  document.body.appendChild(buttonElement);
}

const replaceGrid = async (type) => {
  const holder = document.querySelector('#recipe-stuff')
  if(global.grid){
    holder.removeChild(global.grid)
    global.grid = null
  }
  const grid = global.grid = new type()
  await holder.prepend(grid)
  grid.clearGrid()
}

const insertRecipeList = () => {
  const recipes = global.recipeList = document.createElement('select')
  recipes.multipe=true
  recipes.size="30"
  recipes.style = css`
    width: 300px;
    margin-left: 100px;
    flex-grow: 1;
  `
  recipes.addEventListener('change', (e)=>{
    loadRecipe(e.target.value)
  })
  document.querySelector('#recipe-stuff').appendChild(recipes)
}

const recipeTypes = {
  'minecraft:crafting_shaped': ShapedCrafting
}

const loadRecipe = (name)=>{
  console.log(`Loading recipe ${name}`)
  const namespace = name.split(':')[0]
  const id = name.split(':')[1]
  const recipe = global.recipes[namespace][id] 
  console.log(`Recipe type ${recipe.type}`)
  if(Object.keys(recipeTypes).includes(recipe.type)){
    replaceGrid(recipeTypes[recipe.type])
    setTimeout(()=>{
      global.grid.importRecipe(recipe,name)
    },50)
  }
}

const addRecipe = (name,type) => {
  const namespace = name.split(':')[0]
  const id = name.split(':')[1]
  let namespaceCatagory = global.recipeList.querySelector('optgroup#'+namespace)
  if(!namespaceCatagory){
    namespaceCatagory = document.createElement('optgroup')
    namespaceCatagory.id = namespace
    namespaceCatagory.label = namespace
    global.recipeList.appendChild(namespaceCatagory)
  }
  const selectorId = id.split('/').join('\\')
  if(!namespaceCatagory.querySelector('#'+selectorId)){
    const recipe = document.createElement('option')
    recipe.value = name
    recipe.textContent = id
    recipe.id = selectorId
    if(recipeTypes[type]){
      recipe.disabled=false
    }else{
      recipe.disabled=true
    }
    namespaceCatagory.appendChild(recipe)
  }
}

document.addEventListener('DOMContentLoaded', function() {
  replaceGrid(recipeTypes['minecraft:crafting_shaped'])
  insertRecipeList()
  insertUploadButton()
  insertExportButton()
},false)

const parseTagsIntoImages = async (tags) => {

}

const loadMainJson = (file)=>{
  if(file.type!="application/json"){
    alert("Invalid file type. please upload a json file")
    return
  }
  const reader = new FileReader()
  reader.addEventListener('load',(e)=>{
    const mainJson = JSON.parse(e.target.result);
    parseMainJson(mainJson)
  },false)
  reader.readAsText(file)
}

const loadPackage = async (file)=>{
  console.log(file)
  const zipPackage = await JSZip.loadAsync(file)
  const loads = []
  let mainJson = {}
  zipPackage.forEach((_,file)=>{
    loads.push((async ()=>{
      const splitPath = file.name.split('/')
      const nameSplit = splitPath.pop().split('.')
      const ext = nameSplit.pop()
      const name = nameSplit.join('.')
      const path = splitPath.join('/')
      if(ext == "png"){
        const blob = await file.async('blob')
        global.images.set(name,blob)
      }else if(ext == "json"){
        mainJson = JSON.parse(await file.async('text'))
      }
    })())
  })
  await Promise.all(loads)
  await parseMainJson(mainJson)
  console.log("Clearing Grid")
  replaceGrid(recipeTypes['minecraft:crafting_shaped'])
  if(global.selector){
    global.selector.parentNode.removeChild(global.selector)
    global.selector = null
  }
  generateItemSelector()
}

const parseMainJson = (mainJson) => {
  console.log(mainJson)
  if(mainJson.registries){
    if(mainJson.registries.items){
      const items = mainJson.registries.items.sort()
      const masterList = {special:['empty','undefined']}

      items.forEach(item=>{
        const parts = item.split(":")
        if(!masterList[parts[0]])masterList[parts[0]]=[]
        masterList[parts[0]].push(parts[1])
      })

      global.masterList.items = masterList
    }
  }
  if(mainJson.tags){
    if(mainJson.tags.items){
      const tags = mainJson.tags.items
      const masterList = {}

      Object.keys(tags).sort().forEach(tag=>{
        const parts = tag.split(":")
        if(!masterList[parts[0]])masterList[parts[0]]={}
        masterList[parts[0]][parts[1]]=tags[tag]
      })
      console.log(masterList)

      global.masterList.tags = masterList
    }
  }
  if(mainJson.recipes){
    const recipes = new Map(Object.entries(mainJson.recipes).sort())
    recipes.forEach((instance,name)=>{
      const namespace = name.split(":")[0]
      const id = name.split(":")[1]
      if(!global.recipes[namespace])global.recipes[namespace]={}
      addRecipe(name,instance.recipe.type)
      global.recipes[namespace][id]=instance.recipe
    })
  }
}

const chainTags = (tag)=>{
  const splitTest = tag.split('#')
  if(splitTest.length==1){
    return tag
  }else{
    const name = splitTest[1].split(":")[0]
    const id = splitTest[1].split(":")[1]
    return global.masterList.tags[name][id].map(x=>{
      return chainTags(x)
    })
  }
}

