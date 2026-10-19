import { NodeViewWrapper } from '@tiptap/react';
import InlineBlogImage from '../components/blog/InlineBlogImage';
export default function RichImageNodeView({node,selected,updateAttributes,deleteNode}) {
  const {image,caption}=node.attrs;
  return <NodeViewWrapper className={`rich-image-node ${selected?'is-selected':''}`} contentEditable={false}><div data-drag-handle><InlineBlogImage image={image} caption={caption}/></div>{selected&&<div className="rich-image-controls"><label>Image description<input aria-label="Inline image description" maxLength={240} value={image.alt} onChange={e=>updateAttributes({image:{...image,alt:e.target.value}})}/></label><label>Caption<input aria-label="Inline image caption" maxLength={240} value={caption} onChange={e=>updateAttributes({caption:e.target.value})}/></label><button type="button" onClick={deleteNode}>Remove inline image</button></div>}</NodeViewWrapper>;
}
