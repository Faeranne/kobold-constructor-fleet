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

import { css } from 'lit';
import JSZip from 'jszip'

import { global } from './store.ts'
import { replaceGrid, recipeTypes, addRecipe, loadRecipe } from './crafting.ts'
import { ItemSelector } from './elements.ts'

export const generateItemSelector = ()=>{
  global.selector = new ItemSelector()
  global.selector.items = global.masterList.items
  global.selector.tags = {}
  Object.keys(global.masterList.tags).forEach(namespace=>{
    global.selector.tags[namespace]=Object.keys(global.masterList.tags[namespace])
  })
  console.log(global.selector.tags)
  document.body.prepend(global.selector)
}

export const insertUploadButton = () => {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.addEventListener('change', (e)=>{
    loadPackage(e.target.files[0])
  },false);
  document.body.appendChild(inputElement);
}

export const insertExportButton = () => {
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

export const insertRecipeList = () => {
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

export const loadMainJson = (file)=>{
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

export const loadPackage = async (file)=>{
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

export const parseMainJson = (mainJson) => {
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

export const generateDataPack = async () => {
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

document.addEventListener('DOMContentLoaded', function() {
  replaceGrid(recipeTypes['minecraft:crafting_shaped'])
  insertRecipeList()
  insertUploadButton()
  insertExportButton()
},false)
