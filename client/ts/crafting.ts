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
import empty from '../images/empty.png';
import undefined_image from '../images/undefined.png';

import { chainTags } from './utils.ts'
import { ItemDisplay } from './elements.ts'
import { ShapedCrafting } from './recipes/minecraft/crafting_shaped.ts'

const global = window.global = {images:new Map(),selector:null,recipes:{},masterList:{}}

export const recipeTypes = {
  'minecraft:crafting_shaped': ShapedCrafting
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

export const replaceGrid = async (type) => {
  const holder = document.querySelector('#recipe-stuff')
  if(global.grid){
    holder.removeChild(global.grid)
    global.grid = null
  }
  const grid = global.grid = new type()
  await holder.prepend(grid)
  grid.clearGrid()
}


export const loadRecipe = (name)=>{
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

export const addRecipe = (name,type) => {
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

