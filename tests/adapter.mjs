import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export function database(path=':memory:'){
 const sql=new DatabaseSync(path);sql.exec('PRAGMA foreign_keys = ON');sql.exec(readFileSync(new URL('../drizzle/0000_even_warlock.sql',import.meta.url),'utf8'));
 class Statement{constructor(query,args=[]){this.query=query;this.args=args;}bind(...args){return new Statement(this.query,args);}async first(){return sql.prepare(this.query).get(...this.args)||null;}async all(){return {results:sql.prepare(this.query).all(...this.args)};}async run(){const r=sql.prepare(this.query).run(...this.args);return {meta:{changes:r.changes,last_row_id:r.lastInsertRowid}};}}
 return {prepare:q=>new Statement(q),batch:async statements=>{sql.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}},close:()=>sql.close()};
}
export function bucket(){const entries=new Map();return {entries,put:async(k,b,o)=>entries.set(k,{body:new Uint8Array(b),httpMetadata:o?.httpMetadata}),get:async k=>{const x=entries.get(k);return x?{...x,body:x.body}:null;},delete:async k=>entries.delete(k)};}
