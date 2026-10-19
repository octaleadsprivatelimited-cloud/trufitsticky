import { validCoverImage } from './images.mjs';
export function imageMetadata(image) {
  return image && validCoverImage(image) ? {id:image.id,name:image.name,alt:image.alt,width:image.width,height:image.height} : null;
}
export function normalizeRichText(value) {
  let remaining=3000;
  function clean(node, depth=0) {
    if(!node || typeof node!=='object' || depth>12 || --remaining<0)return null;
    const children=()=>Array.isArray(node.content)?node.content.map(n=>clean(n,depth+1)).filter(Boolean):[];
    if(node.type==='text') {
      if(typeof node.text!=='string'||!node.text)return null;
      const marks=[...new Set((Array.isArray(node.marks)?node.marks:[]).filter(m=>['bold','italic'].includes(m?.type)).map(m=>m.type))].map(type=>({type}));
      return {type:'text',text:node.text,...(marks.length?{marks}:{})};
    }
    if(node.type==='hardBreak')return {type:'hardBreak'};
    if(['paragraph','heading'].includes(node.type))return {type:node.type,...(node.type==='heading'?{attrs:{level:node.attrs?.level===3?3:2}}:{}),content:children().filter(n=>['text','hardBreak'].includes(n.type))};
    if(node.type==='trufitImage') {
      const image=imageMetadata(node.attrs?.image);
      return image ? {type:'trufitImage',attrs:{image,caption:typeof node.attrs?.caption==='string'?node.attrs.caption.slice(0,240):''}} : null;
    }
    if(['bulletList','orderedList'].includes(node.type)) {
      const content=children().filter(n=>n.type==='listItem');
      return content.length?{type:node.type,...(node.type==='orderedList'?{attrs:{start:Math.min(9999,Math.max(1,Math.trunc(Number(node.attrs?.start)||1)))}}:{}),content}:null;
    }
    if(['doc','blockquote','listItem'].includes(node.type)) {
      const content=children().filter(n=>['paragraph','heading','bulletList','orderedList','blockquote','trufitImage'].includes(n.type));
      if(node.type==='listItem'&&content[0]?.type!=='paragraph')content.unshift({type:'paragraph',content:[]});
      return {type:node.type,content};
    }
    return null;
  }
  const doc=value?.type==='doc'?clean(value):null;
  return doc?.content?.length?doc:{type:'doc',content:[{type:'paragraph',content:[]}]};
}
export function paragraphsToRichText(paragraphs=[]) {
  return normalizeRichText({type:'doc',content:paragraphs.filter(p=>typeof p==='string').map(text=>({type:'paragraph',content:text?[{type:'text',text}]:[]}))});
}
export const sectionDocument = section => section.richText ? normalizeRichText(section.richText) : paragraphsToRichText(section.paragraphs);
export function richTextParagraphs(value) {
  const paragraphs=[];
  function visit(node) {
    if(['paragraph','heading'].includes(node.type)) {const text=(node.content||[]).map(n=>n.type==='text'?n.text:'\n').join('');if(text.trim())paragraphs.push(text);}
    else if(node.type==='trufitImage') {if(node.attrs.caption)paragraphs.push(node.attrs.caption);}
    else (node.content||[]).forEach(visit);
  }
  visit(normalizeRichText(value));return paragraphs;
}
export const sectionParagraphs = section => section.richText ? richTextParagraphs(section.richText) : section.paragraphs;
export function richTextImages(value) {
  const images=[];
  function visit(node){if(node.type==='trufitImage')images.push(node.attrs.image);(node.content||[]).forEach(visit);}
  visit(normalizeRichText(value));return images;
}
export function richTextHasContent(value) {return richTextParagraphs(value).some(p=>p.trim()) || richTextImages(value).length>0;}
