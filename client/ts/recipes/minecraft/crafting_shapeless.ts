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

@customElement('shapeless-crafting')
export class ShapelessCrafting extends LitElement {
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
    const items = Array.from(grid.querySelectorAll('item-slot.input')).filter(x=>x.elementid.split(":")[0]!='special')
      .map(x=>{
        const res = {}
        res[x.type]=x.elementid
        return res
      })
    const result = grid.querySelector('item-slot.result')
    const finishedRecipe = {
      type:"minecraft:crafting_shapeless",
      result:{
        item: result.elementid
      },
      ingredients:items
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
    const items = Array.from(grid.querySelectorAll('item-slot.input'));
    const pattern = Array.from(recipe.ingredients)
    const output = grid.querySelector('item-slot.result')
    console.log(recipe)
    output.type="item"
    output.elementid=recipe.result.item
    while(pattern.length<9){
      pattern.push({item:'special:empty'})
    }
    pattern.forEach((item,slot)=>{
      if(item['tag']){
        items[slot].type='tag'
        items[slot].elementid=item.tag
      }
      if(item['item']){
        items[slot].type='item'
        items[slot].elementid=item.item
      }
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
        <div class="row">${map(range(0,3), (e)=>html`<item-slot elementid="" class="input" @change="${this.itemChanged}"/>`)}</div>
        <div class="row">${map(range(3,6), (e)=>html`<item-slot elementid="" class="input" @change="${this.itemChanged}"/>`)}<div class="gap"></div><item-slot elementid="" class="result" @change="${this.itemChanged}"/></div>
        <div class="row">${map(range(6,9), (e)=>html`<item-slot elementid="" class="input" @change="${this.itemChanged}"/>`)}</div>
        <button @click="${this.saveRecipe}">Save</button>
      </div>
    `
  }
}
