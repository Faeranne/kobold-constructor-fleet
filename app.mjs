import fetch from 'node-fetch';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from "node:crypto";
import { unique, scanFiles } from './libs/utils.mjs';
import { getMods } from './libs/generateFiles.mjs';
import { scanImageFolder } from './libs/parseItems.mjs';
import _ from "lodash";

const knownRecipeTypes = {
};


(async ()=>{
  let images = await scanImageFolder();
  let dataExport = JSON.parse(await readFile(join('workdir','minecraft','kubejs','exported','kubejs-server-export.json')))
  let imageList = unique(images.item.map(x=>x.namespace+":"+x.name))
  let missing = dataExport.registries.items.filter(x=>!imageList.includes(x))
  console.log(missing)
  await writeFile('missing.json',JSON.stringify(missing))
  
  /*
  let recipeNamespaces = (await readdir('./crafting_types')).filter(e=>!!e)
  await Promise.all(recipeNamespaces.map(async name=>{
    let recipeTypes = (await readdir(join('./crafting_types',name))).filter(e=>!!e)
    await Promise.all(recipeTypes.map(async type=>{
      knownRecipeTypes[name+":"+type.slice(0,-4)]=(await import('./'+join('./crafting_types',name,type))).processRecipe
    }))
  }))
  */
  /*
  let crafted = []
  let used = []
  let tags = []
  let tagsUsed = []
  let recipeTypes = []
  let missingTags = []
  const modResults = await getMods()
  const items = modResults.reduce((result,mod)=>{
    const items = mod.items.reduce((result,item)=>{
      const name = item.namespace+":"+item.name
      let existing = {}
      if(result[name]){
        existing = result[name]
      }
      result[name]=_.merge(existing,item)
      return result
    },{})
    return _.merge(result,items)
  },{})
  await writeFile(join('workdir','items.json'),JSON.stringify(items,null,4))
  */
  /*
  crafted = unique(crafted).filter(element=>!!element)
  tagsUsed = unique(tagsUsed).filter(e=>!!e)
  console.log(await scanImageFolder())
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
