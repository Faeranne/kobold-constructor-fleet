import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';
import {classMap} from 'lit/directives/class-map.js';

const global = {}

@customElement('item-display')
export class ItemDisplay extends LitElement {
  static styles = css`img { height:64;width:64 }`;

  @property()
  item = 'empty';

  itemModel(e){

  }

  render() {
    return html`<img height="128" width="128" @click="${this.itemModel}" src="./images/items/${this.item}.png">`;
  }
}

@customElement('item-slot')
export class ItemSlot extends ItemDisplay {
  itemModel(e){
    global.selector.target = this
    global.selector.openDialog = true
  }
}

@customElement('shaped-crafting')
export class ShapedCrafting extends LitElement {
  static styles = css`.row { display: flex; flex-direction: row; padding-bottom: 1% } .grid { display: flex; flex-direction: column} item-slot{ padding-right: 1%}`;

  @property()
  ingredients = ['empty','empty','empty','empty','empty','empty','empty','empty','empty'];

  @property()
  result = 'empty';

  generateRecipe(){
    const grid = this.shadowRoot.querySelector('.grid')
    const items = Array.from(grid.querySelectorAll('item-slot'))
    return items.map(x=>x.item)
  }

  importRecipe(recipe){
    const grid = this.shadowRoot.querySelector('.grid')
    const items = Array.from(grid.querySelectorAll('item-slot'))
    recipe.forEach((item,slot)=>{
      items[slot].item=item
    })
  }
  
  render() {
    return html`
      <div class="grid">
        <div class="row">${map(range(0,3), (e)=>html`<item-slot item="${this.ingredients[e]}"/>`)}</div>
        <div class="row">${map(range(3,6), (e)=>html`<item-slot item="${this.ingredients[e]}"/>`)}</div>
        <div class="row">${map(range(6,9), (e)=>html`<item-slot item="${this.ingredients[e]}"/>`)}</div>
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
  `

  @state()
  openDialog = false

  @property()
  items = {special:["empty"]}

  open(){
    this.openDialog = true
  }

  target = null

  select(e){
    if(this.target){
      this.target.item = e.target.item
      this.openDialog=false
    }
  }
  render(){
    return html`
      <dialog ?open=${this.openDialog}>
        <h1>Item Selector</h1>
        <div id="itemList">
          ${map(Object.keys(this.items),(name)=> {
            const itemList = this.items[name]
            return html`<div>
              <h3>${name}</h3>
              ${map(itemList,(item)=> html`<item-display @click="${this.select}" item="${name}:${item}"></item-display>`)}
              </div>`
          })}
        </div>
      </dialog>
    `
  }
}

const generateItemSelector = ()=>{
  global.selector = new ItemSelector()

  document.body.prepend(global.selector)
}
document.addEventListener('DOMContentLoaded', function() {
  generateItemSelector()
},false)
