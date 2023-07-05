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
