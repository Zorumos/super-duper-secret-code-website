/* Byte helpers for browsers predating the typed-array encoding methods used by PDF.js. */
(() => {
 for(const Type of [Map,WeakMap])if(!Type.prototype.getOrInsertComputed)Object.defineProperty(Type.prototype,'getOrInsertComputed',{value:function(key,callback){if(this.has(key))return this.get(key);const value=callback(key);this.set(key,value);return value;},configurable:true,writable:true});
 if(!Set.prototype.intersection)Object.defineProperty(Set.prototype,'intersection',{value:function(other){return new Set([...this].filter(value=>other.has(value)));},configurable:true,writable:true});
 if(!Promise.withResolvers)Promise.withResolvers=function(){let resolve,reject;const promise=new this((res,rej)=>{resolve=res;reject=rej;});return {promise,resolve,reject};};
 if(!Uint8Array.prototype.toHex)Object.defineProperty(Uint8Array.prototype,'toHex',{value:function(){return Array.from(this,b=>b.toString(16).padStart(2,'0')).join('');},configurable:true,writable:true});
 if(!Uint8Array.prototype.toBase64)Object.defineProperty(Uint8Array.prototype,'toBase64',{value:function(){let text='';for(let i=0;i<this.length;i+=8192)text+=String.fromCharCode(...this.subarray(i,i+8192));return btoa(text);},configurable:true,writable:true});
 if(!Uint8Array.fromBase64)Object.defineProperty(Uint8Array,'fromBase64',{value:function(text){return Uint8Array.from(atob(text),c=>c.charCodeAt(0));},configurable:true,writable:true});
})();
