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

import { global } from './store.ts'

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

