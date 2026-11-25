/* Shared local photo-strip collection. Deleted strips remain recoverable. */
window.PhotoStripStore = (() => {
 const DB='our-little-corner-photostrips-v1',STORE='strips';let opening;
 function open(){if(!opening)opening=new Promise((resolve,reject)=>{if(!window.indexedDB){reject(new Error('This browser cannot save photo strips.'));return;}const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'});};req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('Close other Photostrips tabs and try again.'));req.onsuccess=()=>{const db=req.result;db.onversionchange=()=>{db.close();opening=null;};resolve(db);};}).catch(err=>{opening=null;throw err;});return opening;}
 async function list(){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).getAll();req.onsuccess=()=>{const newest=new Map();for(const record of req.result){const group=record.collectionId||record.id;newest.set(group,Math.max(newest.get(group)||0,record.createdAt||0));}resolve(req.result.sort((a,b)=>{const ga=a.collectionId||a.id,gb=b.collectionId||b.id;return ga===gb?(a.stripNumber||0)-(b.stripNumber||0):(newest.get(gb)-newest.get(ga)||String(ga).localeCompare(String(gb)));}));};req.onerror=()=>reject(req.error);});}
 async function mutate(id,change){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.get(id);let result;req.onsuccess=()=>{try{result=change(req.result);if(result)store.put(result);}catch(err){tx.abort();reject(err);}};req.onerror=()=>reject(req.error);tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('The change could not be saved.'));});}
 return {
  list,
  async save(record){if(!record.id||!(record.blob instanceof Blob)||record.blob.type!=='image/png')throw new Error('The photo strip is not ready to save.');return mutate(record.id,old=>({...record,createdAt:old?.createdAt||record.createdAt||Date.now(),updatedAt:Date.now(),deletedAt:old?.deletedAt??null}));},
  remove(id){return mutate(id,old=>old?{...old,deletedAt:Date.now()}:undefined);},
  restore(id){return mutate(id,old=>old?{...old,deletedAt:null}:undefined);}
 };
})();
