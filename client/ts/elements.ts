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
import {classMap} from 'lit/directives/class-map.js';
import {map} from 'lit/directives/map.js';

import { AnimationController } from './controllers.ts'
import { global } from './store.ts'

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
