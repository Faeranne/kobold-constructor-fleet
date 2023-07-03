import { join, resolve } from 'node:path';

export function unique(a){
  return Array.from(new Set(a))
}

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
