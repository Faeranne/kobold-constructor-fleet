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

import fetch from 'node-fetch';
import { writeFile, readFile, copyFile, mkdir, readdir, open } from 'node:fs/promises';
import { join } from 'node:path';
import { unique } from './libs/utils.mjs';
import { scanImageFolder } from './libs/parseItems.mjs';
import _ from "lodash";
import JSZip from "jszip";

const knownRecipeTypes = {
};


(async ()=>{
  let images = await scanImageFolder();
  let dataExport = JSON.parse(await readFile(join('workdir','minecraft','kubejs','exported','kubejs-server-export.json')))
  let imageMap = new Map()
  images.item.forEach(item=>{
    imageMap.set(item.namespace+":"+item.name,item)
  })
  let missing = dataExport.registries.items.filter(x=>!imageMap.has(x))
  let found = dataExport.registries.items.filter(x=>imageMap.has(x))
  await mkdir(join('workdir','images','items'),{recursive:true})
  imageMap.forEach((image,name)=>{
    copyFile(join('workdir','minecraft','icon-exports-x128',image.file),join('workdir','images','items',name+".png"))
  })
  missing.forEach((name)=>{
    copyFile(join('undefined.png'),join('workdir','images','items',name+".png"))
  })
  const zip = new JSZip();
  const imageList = await readdir(join('workdir','images','items'))
  imageList.forEach(imageFile=>{
    zip.file(join('images','items',imageFile),readFile(join('workdir','images','items',imageFile)),{createFolders:false})
  })
  zip.file(join('export.json'),readFile(join('workdir','minecraft','kubejs','exported','kubejs-server-export.json')))
  const fd = await open(join('workdir','images.zip'),'w')
  zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
     .pipe(fd.createWriteStream())
     .on('finish',()=>{
      console.log("Zip Finished")
     })
})()
