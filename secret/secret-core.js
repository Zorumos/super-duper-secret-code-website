window.SecretCore = Object.freeze({
 slots(config){return config.stages.flatMap(stage=>stage.slots);},
 normalizeAnswer(text){return String(text??'').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();},
 matchesAnswer(input,expected){return this.normalizeAnswer(input)===this.normalizeAnswer(expected);},
 isSolved(state,index){return state?.solvedStages?.includes(index)===true;},
 canUpload(config,index,state){return this.isSolved(state,index)&&(!config.stages[index]?.requiresFinalCode||state.awarded===true);},
 hasStage(config,index,photos,state){return this.canUpload(config,index,state)&&config.stages[index].slots.every(slot=>photos.has(slot.id));},
 completed(config,photos,state){let count=0;while(count<config.stages.length&&this.hasStage(config,count,photos,state))count++;return count;},
 normalizeState(value){const s=value&&typeof value==='object'?value:{};return {admitted:s.admitted===true,stripDesign:window.PhotoStripDesigns.normalize(s.stripDesign),date:typeof s.date==='string'?s.date:null,huntId:typeof s.huntId==='string'?s.huntId:null,view:Number.isInteger(s.view)&&s.view>=0?s.view:0,solvedStages:Array.isArray(s.solvedStages)?[...new Set(s.solvedStages.filter(n=>Number.isInteger(n)&&n>=0&&n<window.SECRET_CONFIG.stages.length))]:[],collageViewed:s.collageViewed===true,finalUnlocked:s.finalUnlocked===true,awarded:s.awarded===true};},
 validCode(input,config){return String(input).trim()===String(config.entryCode).trim();},
 validFinalCode(input,config){return String(input).trim()===String(config.finalCode).trim();},
 async ensureBlobImage(blob){if(!(blob instanceof Blob)||!blob.type.startsWith('image/'))throw new Error('This upload could not be prepared as an image.');return blob;}
});
