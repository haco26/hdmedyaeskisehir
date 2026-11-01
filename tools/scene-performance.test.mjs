import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';

for(const profile of ['', '-mobile'])test(`prebaked monogram ${profile || 'desktop'} keeps real relief and a bounded payload`,async()=>{
  const packed=await readFile(new URL(`../src/site/assets/hd-monogram-surface-v2${profile}.bin.gz`,import.meta.url));
  assert.ok(packed.length < (profile ? 1_100_000 : 2_100_000));
  const data=gunzipSync(packed);
  const length=data.readUInt32LE(0);
  const metadata=JSON.parse(data.subarray(4,4+length).toString());
  assert.equal(metadata.version,2);
  assert.ok(metadata.userData.relief.maximumRelief > .025);
  assert.ok(metadata.userData.relief.maximumRelief < .03);
  assert.ok(metadata.userData.relief.raisedVertices > 100000);
  assert.deepEqual(Object.keys(metadata.attributes).sort(),['normal','position','uv']);
  assert.equal(data.length,4+Math.ceil(length/4)*4+Object.values(metadata.attributes).reduce((sum,a)=>sum+a.length*2,0));
  assert.ok(metadata.attributes.position.step < .0001);
  assert.ok(metadata.groups.length >= 2);
});
