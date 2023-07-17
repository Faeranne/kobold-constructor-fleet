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

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { scanModelFolder, scanImageFolder, fetchModelFiles, generateItemsFromModels, discoverOverrides, extractItemsFromTags } from './parseItems.mjs';
import { scanTagFolder, fetchTagFiles, mergeTags } from './parseTags.mjs';
import { resolveFileSystem } from "@xmcl/system";
import _ from "lodash";

export async function gatherModDetails(file){
  const jarFS = await resolveFileSystem(file)
  const itemFiles = await scanModelFolder(jarFS)
  const itemModels = await fetchModelFiles(jarFS,itemFiles)
  const overrides = await discoverOverrides(itemModels)
  const modelItems = generateItemsFromModels(itemModels,overrides)
  const tagFiles = await scanTagFolder(jarFS)
  const tags = await fetchTagFiles(jarFS,tagFiles)
  //const returnedTags = {}
  //mergeTags(returnedTags,tags)
  //const tagItems = extractItemsFromTags(returnedTags)
  //const items = unique(modelItems.concat(tagItems))
  const icons = await scanImageFolder();


  return {items:icons.item.concat(modelItems)}
}

export async function getMods(){
  let mods = (await readdir('./mods'))
  let modResults = await Promise.all(mods.map(async mod=>{
    return await gatherModDetails(join('./mods',mod))
  }))
  return modResults
}

export function itemsToNamespace(items){
  const namespaces = {}
  items.forEach(oItem=>{
    const item = structuredClone(oItem)
    const namespace = item.namespace
    const name = item.name
    if(!namespaces[namespace]) namespaces[namespace]={}
    if(!namespaces[namespace][name]) namespaces[namespace][name]={}
    const existingItem = namespaces[namespace][name]
    delete item.name
    delete item.namespace
    namespaces[namespace][name] = {...existingItem,item}
  })
  return namespaces
}

export function recordContents(){

  
}
