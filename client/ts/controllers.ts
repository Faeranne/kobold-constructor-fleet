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

import {ReactiveController, ReactiveControllerHost} from 'lit';

import { chainTags } from './utils.ts'

import spinner from '../images/rings.svg';
import empty from '../images/empty.png';
import undefined_image from '../images/undefined.png';

export class AnimationController implements ReactiveController {
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
