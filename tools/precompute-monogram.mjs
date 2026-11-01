// Offline only: bake the exact procedural surface so visitors never machine it.
import {readFile, writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import * as THREE from '../src/site/vendor/three/build/three.module.js';
import {createReferenceShapes} from '../src/site/logo-shape.js';
const source = await readFile(new URL('../src/site/scene.js', import.meta.url), 'utf8');
const start = source.indexOf('    function shaveCutNormals(');
const end = source.indexOf('    // One continuous solid:', start);
if (start < 0 || end < start) throw new Error('Geometry source boundaries changed; review bake tool');
const mobile = process.argv.includes('--mobile');
const functions = mobile ? source.slice(start,end).replace('.075 ** 2','.12 ** 2') : source.slice(start,end);
const make = new Function('THREE', functions + '\nreturn shape => raisedCapGeometry(capCoordinates(shaveCutNormals(new THREE.ExtrudeGeometry(shape, {depth:.44,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:6,steps:1,curveSegments:40}))),shape);')(THREE);
const geometry = createReferenceShapes(THREE).map(make);
if (geometry.length !== 1) throw new Error('Expected the single continuous HD shape');
const g = geometry[0];
const attributes = Object.fromEntries(Object.entries(g.attributes).map(([name,a])=>{
  let min=Infinity,max=-Infinity; for(const n of a.array){min=Math.min(min,n);max=Math.max(max,n);}
  const step=(max-min)/65535 || 1;
  const values=new Uint16Array(a.array.length); for(let i=0;i<values.length;i++)values[i]=Math.round((a.array[i]-min)/step);
  return [name,{itemSize:a.itemSize,length:values.length,min,step,values}];
}));
const metadata = Buffer.from(JSON.stringify({version:2, groups:g.groups, userData:g.userData, attributes:Object.fromEntries(Object.entries(attributes).map(([name,{values,...info}])=>[name,info]))}));
const padded = Math.ceil(metadata.length / 4) * 4;
const header = Buffer.alloc(4 + padded); header.writeUInt32LE(metadata.length); metadata.copy(header,4);
const data = [header,...Object.values(attributes).map(a=>Buffer.from(a.values.buffer))];
const compressed=gzipSync(Buffer.concat(data),{level:9});
await writeFile(new URL(`../src/site/assets/hd-monogram-surface-v2${mobile?'-mobile':''}.bin.gz`,import.meta.url),compressed);
console.log(JSON.stringify({bytes:compressed.length,decodedBytes:data.reduce((sum,b)=>sum+b.length,0),vertices:g.attributes.position.count,relief:g.userData.relief}));
