// Functional model cache only: no cookies, user identifiers or analytics.
const MOBILE = typeof matchMedia === 'function' && (matchMedia('(max-width: 850px)').matches || matchMedia('(pointer: coarse)').matches);
const VERSION = 'hd-solid-bezier4-relief029-rim008-v2' + (MOBILE ? '-mobile' : '');
async function db(){return new Promise((resolve,reject)=>{const r=indexedDB.open('hd-medya-model',1);r.onupgradeneeded=()=>r.result.createObjectStore('geometry');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('blocked'));});}
async function readStoredGeometry(){try{return await Promise.race([ (async()=>{const d=await db();try{return await new Promise((resolve,reject)=>{const r=d.transaction('geometry').objectStore('geometry').get(VERSION);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}finally{d.close();}})(),new Promise(resolve=>setTimeout(()=>resolve(null),100)) ]);}catch{return null;}}
export async function readGeometry(){
  const stored = await readStoredGeometry();
  if (stored?.attributes?.position && stored.groups && stored.userData) return stored;
  if (typeof DecompressionStream !== 'function') return null;
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(),15000);
  try {
    const url = new URL(`./assets/hd-monogram-surface-v2${MOBILE?'-mobile':''}.bin.gz`,import.meta.url);
    const response = await fetch(url,{signal:controller.signal,cache:'force-cache'});
    if (!response.ok) return null;
    const packed = await response.arrayBuffer();
    const magic = new Uint8Array(packed,0,Math.min(2,packed.byteLength));
    const buffer = magic[0] === 31 && magic[1] === 139
      ? await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
      : packed;
    const size = new DataView(buffer).getUint32(0,true);
    if (size > 20000 || size + 4 > buffer.byteLength) return null;
    const metadata = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,4,size)));
    if (metadata.version !== 2 || !Array.isArray(metadata.groups)) return null;
    let offset = 4 + Math.ceil(size/4)*4;
    const attributes = {};
    for (const [name,info] of Object.entries(metadata.attributes)) {
      if (!['position','normal','uv'].includes(name) || offset + info.length*2 > buffer.byteLength) return null;
      const source = new Uint16Array(buffer,offset,info.length);
      const array = new Float32Array(info.length);
      for(let i=0;i<source.length;i++) array[i] = info.min + source[i]*info.step;
      attributes[name]={array,itemSize:info.itemSize}; offset += info.length*2;
    }
    const result={attributes,groups:metadata.groups,userData:metadata.userData};
    saveGeometry(result);
    return result;
  } catch {return null;} finally {clearTimeout(timeout);}
}
export async function saveGeometry(geometry){try{const d=await db();try{const value={attributes:Object.fromEntries(Object.entries(geometry.attributes).map(([k,a])=>[k,{array:a.array,itemSize:a.itemSize}])),groups:geometry.groups,userData:geometry.userData};await new Promise((resolve,reject)=>{const t=d.transaction('geometry','readwrite');t.objectStore('geometry').put(value,VERSION);t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error);});return true;}finally{d.close();}}catch{return false;}}
