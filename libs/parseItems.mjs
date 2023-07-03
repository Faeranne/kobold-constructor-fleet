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

export async function scanImageFolder(fs){
  const imageFiles = await readdir(join('workdir','icon-exports-x128'))
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
        model
        ,name:item
      }
    })
  )).flat()
  return models
}

export function generateItemsFromModels(models){
  const overrides = []
  models.forEach(item=>{
    const namespace = item.name.split(":")[0]
    const name = item.name.split(":")[1]
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
            overrides.push(overName+":"+overId)
          }
        }
      })
    }
  })
  const itemNames = models.map(x=> ({name:x.name,map:x.name})).filter(x=>!overrides.includes(x.split(":")[0]+":item/"+x.split(":")[1]))
  return itemNames
}

//tags returned from parseTags
export async function extractItemsFromTags(tags){
  let items = []
  for(let tag in tags){
    items = items.concat(tags[tag])
  }
  return unique(items)
}

export async function parseImages(){
  const icons = fsNode.readdir(join('workdir','icon-exports-x128'))

}
