/*
 *   Copyright (C) 2023 Nina Morgan
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {html, css, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';

import { unique } from '../../../../libs/utils.mjs';
import { global } from '../../store.ts'

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
    const cleanedPattern = trimmedPattern.map(x=>x.substr(0,largestLength)).filter(x=>x.trim().length>0)
    const finishedRecipe = {
      type:"minecraft:crafting_shaped",
      result:{
        item: result.split('^')[1],
      },
      pattern: cleanedPattern,
      key: processedKey,
    }
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
