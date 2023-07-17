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

export async function scanRecipeFolder(fs){
  const dataNS = (await fs.listFiles('data')).filter(entry=>entry.length>0)
  //Gather all recieps from the known namespaces. use `scanFiles` to recursivly scan them.
  const recipeFiles = (await Promise.all(
    dataNS.map(
      async (namespace)=>{
        if (await fs.existsFile(join('data',namespace,'recipes'))){
          return (await scanFiles(fs,join('data',namespace,'recipes'),'')).map(line=>namespace+":"+line)
        }
      }
    )))
    .filter(entry=>!!entry)[0]
  return recipeFiles
}

export async function fetchRecipeContent(fs,recipeFiles){
  //Fetch all recipe data from known recipe files.
  const recipes = (await Promise.all(
    recipeFiles.map(
      async (recipeFile)=>{
        const namespace = recipeFile.split(":")[0]
        const file = recipeFile.split(":")[1]
        //Verify files exist due to bug with scanFiles that creates additional phantom folders when a file starts with the same string as a folder.
        if(!(await fs.existsFile(join('data',namespace,'recipes',file)))){
          return undefined
        }
        const recipeContents = JSON.parse((await fs.readFile(join('data',namespace,'recipes',file))).toString())
        return {name:recipeFile.slice(0,-5),recipe:recipeContents}
      }
    )
  ))
    .flat()
    .filter(item=>!!item)

  return recipes
}

export function sortRecipes(recipes){
  const sortedRecipes = {}
  recipes.forEach(recipeData=>{
    if(!sortedRecipes[recipeData.recipe.type]){
      sortedRecipes[recipeData.recipe.type]=[]
    }
    sortedRecipes[recipeData.recipe.type].push(recipeData)
  })
  return sortedRecipes
}
