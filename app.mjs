import fetch from 'node-fetch';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { resolveFileSystem } from "@xmcl/system";
import { createHash } from "node:crypto";
import { unique, scanFiles } from './libs/utils.mjs';
import { scanModelFolder, scanImageFolder, fetchModelFiles, generateItemsFromModels, extractItemsFromTags } from './libs/parseItems.mjs';
import { scanTagFolder, fetchTagFiles, mergeTags } from './libs/parseTags.mjs';

const knownRecipeTypes = {
}

async function gatherModDetails(file){
  const jarFS = await resolveFileSystem(file)
  const itemFiles = await scanModelFolder(jarFS)
  const itemModels = await fetchModelFiles(jarFS,itemFiles)
  const modelItems = generateItemsFromModels(itemModels)
  const tagFiles = await scanTagFolder(jarFS)
  const tags = await fetchTagFiles(jarFS,tagFiles)
  const returnedTags = {}
  mergeTags(returnedTags,tags)
  const tagItems = extractItemsFromTags(returnedTags)
  const items = unique(modelItems.concat(tagItems))
  console.log(items)
  return {itemModels,tags,items}
}

(async ()=>{
  /*
  let recipeNamespaces = (await readdir('./crafting_types')).filter(e=>!!e)
  await Promise.all(recipeNamespaces.map(async name=>{
    let recipeTypes = (await readdir(join('./crafting_types',name))).filter(e=>!!e)
    await Promise.all(recipeTypes.map(async type=>{
      knownRecipeTypes[name+":"+type.slice(0,-4)]=(await import('./'+join('./crafting_types',name,type))).processRecipe
    }))
  }))
  */
  let items = []
  let crafted = []
  let used = []
  let tags = []
  let tagsUsed = []
  let recipeTypes = []
  let missingTags = []
  let mods = (await readdir('./mods'))
  let modResults = await Promise.all(mods.map(async mod=>{
    return await gatherModDetails(join('./mods',mod))
  }))
  modResults.forEach((mod)=>{
    items = items.concat(mod.items)
    //used = used.concat(mod.used)
    //crafted = crafted.concat(mod.crafted)
    //Object.assign(tags,mod.tags)
    //recipeTypes = recipeTypes.concat(mod.recipeTypes)
    //tagsUsed = tagsUsed.concat(mod.tagsUsed)
  })
  crafted = unique(crafted).filter(element=>!!element)
  tagsUsed = unique(tagsUsed).filter(e=>!!e)
  console.log(await scanImageFolder())
  /*
  used = unique(used).filter(element=>!!element)
  tagsUsed.forEach(tag=>{
    if(tags[tag]){
      items = items.concat(tags[tag])
    }else{
      missingTags.push(tag)
    }
  })
  missingTags = unique(missingTags)
  items = unique(items).filter(element=>!!element)
  recipeTypes = unique(recipeTypes).sort().filter(element=>!!element)
  */
  
  /*
  console.log("Created Items that Already Exist:")
  console.log(crafted.filter(x=>items.includes(x)))
  console.log("Created Items that didn't exist yet:")
  console.log(crafted.filter(x=>!items.includes(x)))
  console.log("Needed Items that Already Exist:")
  console.log(used.filter(x=>items.includes(x)))
  console.log("Needed Items that didn't exist yet:")
  console.log(used.filter(x=>!items.includes(x)))
  items = items.concat(crafted)
  items = items.concat(used)
  items = unique(items)
  console.log("Items that are never used:")
  console.log(items.filter(x=>!used.includes(x)))
  console.log("Items that are never made:")
  console.log(items.filter(x=>!crafted.includes(x)))
  console.log(`Items used vs total items: ${used.length}/${items.length}`)
  console.log(`Items created vs total items: ${crafted.length}/${items.length}`)
  console.log(recipeTypes)
  console.log(missingTags) 
  */
})()
