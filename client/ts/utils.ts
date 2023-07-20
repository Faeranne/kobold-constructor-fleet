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

const global = window.global

export const chainTags = (tag)=>{
  const splitTest = tag.split('#')
  if(splitTest.length==1){
    return tag
  }else{
    const name = splitTest[1].split(":")[0]
    const id = splitTest[1].split(":")[1]
    return global.masterList.tags[name][id].map(x=>{
      return chainTags(x)
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
