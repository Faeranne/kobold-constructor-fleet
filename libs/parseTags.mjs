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

import { join } from 'node:path';
import { unique, scanFiles } from './utils.mjs';

export async function scanTagFolder(fs){
  const dataNS = (await fs.listFiles('data')).filter(entry=>entry.length>0)
  //Gather all tags from the known namespaces. use `scanFiles` to recursivly scan them.
  const tagFiles = (await Promise.all(
    dataNS.map(
      async (namespace)=>{
        if (await fs.existsFile(join('data',namespace,'tags','items'))){
          return (await scanFiles(fs,join('data',namespace,'tags','items'),'')).map(line=>namespace+":"+line)
        }
      }
    )))
    .filter(entry=>!!entry)[0]
  return tagFiles
}

export async function fetchTagFiles(fs,tagFiles){
  //Fetch all tag data from known tag files.
  const tags = (await Promise.all(
    tagFiles.map(
      async (tagFile)=>{
        const namespace = tagFile.split(":")[0]
        const file = tagFile.split(":")[1]
        //Verify files exist due to bug with scanFiles that creates additional phantom folders when a file starts with the same string as a folder.
        if(!(await fs.existsFile(join('data',namespace,'tags','items',file)))){
          return undefined
        }
        const tagContents = JSON.parse((await fs.readFile(join('data',namespace,'tags','items',file))).toString())
        return {name:tagFile.slice(0,-5),tag:tagContents}
      }
    )
  ))
    .flat()
    .filter(item=>!!item)

  return tags
}

export function mergeTags(existingTags,newTags){
  newTags.forEach(tag=>{
    if(!existingTags[tag.name]){
      existingTags[tag.name]=[]
    }
    if(tag.tag.replace){
      existingTags[tag.name]=tag.tag.values
    }else{
      existingTags[tag.name]=unique(existingTags[tag.name].concat(tag.tag.values))
    }
  })
}

