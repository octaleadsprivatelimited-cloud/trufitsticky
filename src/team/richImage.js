import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { imageMetadata } from '../blog/richText.mjs';
import RichImageNodeView from './RichImageNodeView';
export default Node.create({
  name:'trufitImage',group:'block',atom:true,draggable:true,
  addAttributes(){return {image:{default:null},caption:{default:''}};},
  parseHTML(){return [{tag:'figure[data-trufit-image]',getAttrs:element=>{try{const image=imageMetadata(JSON.parse(element.getAttribute('data-trufit-image')));return image?{image,caption:(element.getAttribute('data-caption')||'').slice(0,240)}:false;}catch{return false;}}}];},
  renderHTML({node}){return ['figure',{'data-trufit-image':JSON.stringify(imageMetadata(node.attrs.image)),'data-caption':node.attrs.caption}];},
  addNodeView(){return ReactNodeViewRenderer(RichImageNodeView);},
});
