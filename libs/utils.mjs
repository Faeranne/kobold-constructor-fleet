export function unique(a){
  return Array.from(new Set(a))
}

export function getKey(map,val) {
  return Object.keys(map).find(key => map[key] === val);
}
