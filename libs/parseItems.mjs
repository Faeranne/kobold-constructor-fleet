import { join } from 'node:path';
import { readdir } from 'node:fs/promises';
import { unique, scanFiles } from './utils.mjs';

export async function scanModelFolder(fs){
  const resNS = (await fs.listFiles('assets')).filter(entry=>entry.length>0)
  const modelFiles = (await Promise.all(
    resNS.map(
      async (namespace)=>{
        if (await fs.existsFile(join('assets',namespace,'models','item'))){
          return (await scanFiles(fs,join('assets',namespace,'models','item'),''))
            .filter(entry=>entry.length>0) //remove empty lines
            .map(entry=>entry.slice(0,-5)) //remove .json extension
            .map(entry=>namespace+":"+entry) //map with namespace
        }
      }
    )
  )).flat().filter(entry=>!!entry)
  return modelFiles
}

export async function scanImageFolder(){
  const imageFiles = await readdir(join('workdir','minecraft','icon-exports-x128'))
  const images = imageFiles.map(iconFile=>{
    const dataSplit = iconFile.split("{");
    const front = dataSplit.shift()
    const data = dataSplit.join("{")
    const frontSplit = front.split("__").filter(x=>x.length>0)
    const res = {}
    if(frontSplit.length>2){
      res.type=frontSplit.shift()
    }else{
      res.type='item'
    }
    res.namespace = frontSplit.shift()
    // remove .png if it wasn't part of the data split.
    res.name = frontSplit.shift().split('.').filter(x=>x!='png').join('.')
    res.file = iconFile
    return res
  })
  const res = {}
  images.forEach(image=>{
    if(!res[image.type]) res[image.type] = [];
    res[image.type].push(image)
  })
  return res
}

export async function fetchModelFiles(fs,modelFiles){
  const models = (await Promise.all(
    modelFiles.map(async (item)=>{
      const namespace = item.split(":")[0]
      const file = item.split(":")[1]
      const modelContent = await fs.readFile(join('assets',namespace,'models','item',file+'.json'))
      const model = JSON.parse(modelContent)
      return {
        model,
        name: file,
        namespace: namespace
      }
    })
  )).flat()
  return models
}

export function discoverOverrides(models){
  const overrides = []
  models.forEach(item=>{
    const namespace = item.namespace
    const name = item.name
    if(item.model.overrides){
      item.model.overrides.forEach(override=>{
        if(override.model){
          const overSplit = override.model.split(":")
          let overName = namespace
          let overId = overSplit[0]
          if(overSplit.length>1){
            overName = overSplit[0]
            overId = overSplit[1]
          }
          if(overName == namespace && overId == 'item/'+name){
            return
          }else{
            overrides.push({namespace:overName,name:overId})
          }
        }
      })
    }
  })
  return overrides
}

export function generateItemsFromModels(models,overrides){
  const filteredModels = models.filter(model=>!overrides.some(e=>((e.name=='item/'+model.name)&&(e.namespace==model.namespace))))
  const items = filteredModels.map(model=>{
    return {
      name: model.name,
      namespace: model.namespace,
    }
  })
  return items
}

//tags returned from parseTags
export async function extractItemsFromTags(tags){
  let items = []
  for(let tag in tags){
    items = items.concat(tags[tag])
  }
  return unique(items)
}

