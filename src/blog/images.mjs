export const MAX_COVER_BYTES = 8 * 1024 * 1024;
export const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export function validateCoverFile(file) {
  if (!file || !COVER_TYPES.includes(file.type)) return 'Choose a JPG, PNG, or WebP image.';
  if (!file.size) return 'This image is empty. Choose another file.';
  if (file.size > MAX_COVER_BYTES) return 'Choose an image smaller than 8 MB.';
  return '';
}
export function coverDimensions(width, height, max = 1600) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) throw new Error('This image could not be read. Choose another file.');
  const scale = Math.min(1, max / Math.max(width,height));
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
export function validCoverImage(cover) {
  return cover == null || (typeof cover.id === 'string' && /^cover-[a-z0-9-]{1,80}$/.test(cover.id) &&
    typeof cover.name === 'string' && cover.name.length <= 255 && typeof cover.alt === 'string' && cover.alt.length <= 240 &&
    Number.isInteger(cover.width) && cover.width > 0 && cover.width <= 1600 && Number.isInteger(cover.height) && cover.height > 0 && cover.height <= 1600);
}
let database;
function openImages() {
  if (!database) database = new Promise((resolve,reject)=>{
    const request=indexedDB.open('trufit_blog_images_v1',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('covers',{keyPath:'id'});
    request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();database=undefined;};resolve(db);};
    request.onerror=()=>reject(request.error);
    request.onblocked=()=>reject(new Error('Image storage is busy. Close other editing tabs and try again.'));
  }).catch(error=>{database=undefined;throw error;});
  return database;
}
export async function readCoverAsset(id) {
  const db=await openImages();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction('covers','readonly');
    const request=transaction.objectStore('covers').get(id);
    request.onsuccess=()=>resolve(request.result?.blob instanceof Blob && COVER_TYPES.includes(request.result.blob.type) ? request.result.blob : null);
    request.onerror=()=>reject(request.error);
  });
}
async function storeCoverAsset(asset) {
  const db=await openImages();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction('covers','readwrite');
    transaction.objectStore('covers').put(asset);
    transaction.oncomplete=()=>resolve();
    transaction.onerror=()=>reject(transaction.error);
    transaction.onabort=()=>reject(transaction.error || new Error('Image storage unavailable.'));
  });
}
export async function importCoverImage(file) {
  const error=validateCoverFile(file);
  if(error) throw new Error(error);
  let image;
  try {image=await createImageBitmap(file);} catch {throw new Error('This file could not be opened as an image. Try a different JPG, PNG, or WebP.');}
  let blob,dimensions;
  try {
    dimensions=coverDimensions(image.width,image.height);
    const canvas=document.createElement('canvas');canvas.width=dimensions.width;canvas.height=dimensions.height;
    const context=canvas.getContext('2d');
    if(!context) throw new Error('Image processing is unavailable in this browser.');
    context.drawImage(image,0,0,dimensions.width,dimensions.height);
    blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Could not prepare this image. Try another file.')),'image/webp',.85));
  } finally {image.close();}
  const id='cover-'+crypto.randomUUID();
  try {await storeCoverAsset({id,blob});} catch {throw new Error('Could not store the image in this browser. Free some browser storage and try again.');}
  return {id,name:file.name.slice(0,255),alt:'',...dimensions};
}
