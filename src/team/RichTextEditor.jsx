import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import RichImage from './richImage';
import { importCoverImage } from '../blog/images.mjs';
import { normalizeRichText, sectionDocument } from '../blog/richText.mjs';
import './rich-editor.css';
export default function RichTextEditor({section,onChange,onBusy,disabled}) {
  const input=useRef(null),requestId=useRef(0),position=useRef(0);
  const [imagePanel,setImagePanel]=useState(false),[alt,setAlt]=useState(''),[caption,setCaption]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const editor=useEditor({
    extensions:[StarterKit.configure({heading:{levels:[2,3]},link:false,underline:false,strike:false,code:false,codeBlock:false,horizontalRule:false}),RichImage],
    content:sectionDocument(section),immediatelyRender:false,
    editorProps:{attributes:{role:'textbox','aria-label':'Section content','aria-multiline':'true',class:'rich-editor-content'},handleDrop:(_view,event)=>{if(event.dataTransfer?.files?.length){setError('Use the Image button to upload a picture.');return true;}return false;},handlePaste:(_view,event)=>{if(event.clipboardData?.files?.length){setError('Use the Image button to upload a picture.');return true;}return false;}},
    onUpdate:({editor:current})=>onChange(normalizeRichText(current.getJSON())),
  });
  useEffect(()=>{editor?.setEditable(!disabled,false);},[editor,disabled]);
  useEffect(()=>()=>{requestId.current+=1;},[]);
  const active=useEditorState({editor,selector:({editor:e})=>e?{bold:e.isActive('bold'),italic:e.isActive('italic'),bullet:e.isActive('bulletList'),ordered:e.isActive('orderedList'),quote:e.isActive('blockquote'),block:e.isActive('heading',{level:3})?'h3':e.isActive('heading',{level:2})?'h2':'paragraph',undo:e.can().undo(),redo:e.can().redo()}:null});
  async function upload(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file||!editor)return;
    const token=++requestId.current;setError('');setBusy(true);onBusy(true);
    try {
      const image=await importCoverImage(file);
      if(token!==requestId.current||editor.isDestroyed)return;
      editor.chain().focus().insertContentAt(position.current,[{type:'trufitImage',attrs:{image:{...image,alt:alt.trim()},caption:caption.trim()}},{type:'paragraph'}]).run();
      setImagePanel(false);setAlt('');setCaption('');
    }catch(failure){if(token===requestId.current)setError(failure.message||'Could not insert this image. Please try again.');}
    finally{if(token===requestId.current){setBusy(false);onBusy(false);}}
  }
  function button(label,text,pressed,command,unavailable=false) {return <button type="button" title={label} aria-label={label} aria-pressed={pressed} disabled={!editor||disabled||unavailable} onMouseDown={e=>e.preventDefault()} onClick={command}>{text}</button>;}
  return <div className="rich-editor-field"><span id="section-content-label" className="rich-editor-label">Section content</span><div className={`rich-editor ${disabled?'is-busy':''}`}><div className="rich-editor-toolbar" role="group" aria-label="Text formatting"><label><span className="sr-only">Text style</span><select aria-label="Text style" disabled={!editor||disabled} value={active?.block||'paragraph'} onChange={e=>e.target.value==='paragraph'?editor.chain().focus().setParagraph().run():editor.chain().focus().toggleHeading({level:e.target.value==='h3'?3:2}).run()}><option value="paragraph">Paragraph</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option></select></label>{button('Bold',<strong>B</strong>,Boolean(active?.bold),()=>editor.chain().focus().toggleBold().run())}{button('Italic',<em>I</em>,Boolean(active?.italic),()=>editor.chain().focus().toggleItalic().run())}<span className="rich-toolbar-divider"/>{button('Bullet list','• List',Boolean(active?.bullet),()=>editor.chain().focus().toggleBulletList().run())}{button('Numbered list','1. List',Boolean(active?.ordered),()=>editor.chain().focus().toggleOrderedList().run())}{button('Block quote','“ ”',Boolean(active?.quote),()=>editor.chain().focus().toggleBlockquote().run())}<span className="rich-toolbar-divider"/>{button('Insert image','＋ Image',imagePanel,()=>{setImagePanel(!imagePanel);setError('');})}{button('Undo','↶',undefined,()=>editor.chain().focus().undo().run(),!active?.undo)}{button('Redo','↷',undefined,()=>editor.chain().focus().redo().run(),!active?.redo)}</div>
      {imagePanel&&<div className="rich-image-panel"><strong>Add an image inside your post</strong><p>JPG, PNG or WebP · up to 8 MB · stored in this browser.</p><label>Image description (required)<input maxLength={240} value={alt} disabled={disabled} onChange={e=>setAlt(e.target.value)} placeholder="Describe what the image shows"/></label><label>Caption (optional)<input maxLength={240} value={caption} disabled={disabled} onChange={e=>setCaption(e.target.value)}/></label><div><button type="button" className="team-button" disabled={disabled} onMouseDown={e=>e.preventDefault()} onClick={()=>{if(!alt.trim()){setError('Add an image description before choosing a file.');return;}position.current=editor.state.selection.from;input.current?.click();}}>{busy?'Preparing image…':'Choose inline image'}</button><button type="button" className="team-text-button" disabled={disabled} onClick={()=>setImagePanel(false)}>Cancel</button></div></div>}
      <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={upload}/>
      {error&&<p className="rich-editor-error" role="alert">{error}</p>}{busy&&<p className="rich-editor-help" role="status">Preparing your inline image…</p>}<EditorContent editor={editor}/></div><p className="rich-editor-help">Select text to format it. Use Ctrl/Cmd+B for bold and Ctrl/Cmd+I for italic. Click an inserted image to edit its description or caption.</p></div>;
}
