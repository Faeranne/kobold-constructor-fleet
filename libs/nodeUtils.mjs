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

import { join, resolve } from 'node:path';

export async function scanFiles(fs,base,endpoint){
  const fileList = (await fs.listFiles(join(base,endpoint))).filter(entry=>entry.length>0).map(item=>join(endpoint,item))
  const fileExtra = (await Promise.all(fileList.map(async (file)=>{
    if (await fs.isDirectory(join(base,file))){
      const scanResult = (await scanFiles(fs,base,file))
      return scanResult
    }else{
      return file
    }
    //this filter needs fixing. it also creates phantom folders for items that start with the same string as a folder.  oops.
  }))).filter(entry=>!!entry).flat()
  return fileExtra
}
