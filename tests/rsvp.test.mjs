import test from 'node:test';
import assert from 'node:assert/strict';
import {handleRsvp} from '../lib/rsvp-handler.mjs';
const id='9bd7e3a9-463f-40cb-9e95-d637870c4b76';
const request=(body,options={})=>new Request('https://invite.test/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://invite.test',...options.headers},body:JSON.stringify(body)});
test('only normalized names are bound into SQL, including apostrophes',async()=>{
  let bindings;const db={prepare(sql){assert.match(sql,/INSERT INTO attendance/);return{bind(...args){bindings=args;return{async run(){return{meta:{changes:1}};}};}};}};
  const response=await handleRsvp(request({id,name:"  Mai   O'Connor  "}),db);
  assert.equal(response.status,201);assert.equal(bindings[1],"Mai O'Connor");assert.equal(bindings[0],id);
});
test('rejects empty/oversized names without writing',async()=>{for(const name of [' ','x','a'.repeat(101)])assert.equal((await handleRsvp(request({id,name}),{prepare(){throw new Error('must not write');}})).status,400);});
test('does not expose attendee records',async()=>assert.equal((await handleRsvp(new Request('https://invite.test/api/rsvp'),{})).status,405));
test('rejects cross-origin submissions',async()=>assert.equal((await handleRsvp(request({id,name:'Minh Anh'},{headers:{Origin:'https://other.test'}}),{})).status,403));
test('retry uses idempotent conflict handling',async()=>{const db={prepare(){return{bind(){return{async run(){return{meta:{changes:0}};}};}};}};assert.equal((await handleRsvp(request({id,name:'Minh Anh'}),db)).status,200);});
test('database outage returns failure instead of false success',async()=>{assert.equal((await handleRsvp(request({id,name:'Minh Anh'}),undefined)).status,503);const db={prepare(){throw new Error('offline');}};assert.equal((await handleRsvp(request({id,name:'Minh Anh'}),db)).status,503);});
