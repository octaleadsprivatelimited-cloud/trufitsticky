import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRichText, sectionDocument, richTextParagraphs, richTextImages } from './richText.mjs';
import { initialBlog, blankPost, savePost, validatePost, visiblePosts, readBlog } from './store.mjs';
import { filterArticles } from '../content/blog.mjs';
const text=value=>({type:'text',text:value});
const image=()=>({id:'cover-inline-test',name:'training.webp',alt:'A group preparing for a workout',width:1200,height:800});
const document=()=>({type:'doc',content:[{type:'heading',attrs:{level:3},content:[text('A useful starting point')]},{type:'paragraph',content:[{...text('Start with your questions.'),marks:[{type:'bold'},{type:'italic'}]}]},{type:'bulletList',content:[{type:'listItem',content:[{type:'paragraph',content:[text('A searchable checklist entry')]}]}]},{type:'orderedList',attrs:{start:2},content:[{type:'listItem',content:[{type:'paragraph',content:[text('A numbered step')]}]}]},{type:'trufitImage',attrs:{image:image(),caption:'Your shared starting point'}}]});
const post=()=>({...blankPost(),title:'Rich text guide',slug:'rich-text-guide',excerpt:'A formatted guide.',sections:[{heading:'Getting started',paragraphs:[],richText:document()}]});
test('headings, bold and italic marks, list types, numbering, and image metadata survive normalization',()=>{
 const doc=normalizeRichText(document());
 assert.equal(doc.content[0].attrs.level,3);
 assert.deepEqual(doc.content[1].content[0].marks,[{type:'bold'},{type:'italic'}]);
 assert.equal(doc.content[2].type,'bulletList');
 assert.equal(doc.content[3].attrs.start,2);
 assert.deepEqual(richTextImages(doc),[image()]);
 assert.equal(doc.content[4].attrs.caption,'Your shared starting point');
});
test('unsupported nodes, external image sources, and arbitrary mark attributes cannot reach the renderer',()=>{
 const dirty={type:'doc',content:[{type:'script',attrs:{src:'https://example.com/evil'}},{type:'image',attrs:{src:'javascript:alert(1)'}},{type:'paragraph',attrs:{onload:'alert(1)'},content:[{...text('<script>plain text only</script>'),marks:[{type:'link',attrs:{href:'javascript:alert(1)'}},{type:'bold',attrs:{onclick:'evil'}}]}]},{type:'trufitImage',attrs:{image:{...image(),id:'https://example.com/track'}}}]};
 const safe=normalizeRichText(dirty);
 assert.equal(safe.content.length,1);
 assert.deepEqual(safe.content[0].content[0].marks,[{type:'bold'}]);
 assert.equal(safe.content[0].content[0].text,'<script>plain text only</script>');
 assert.ok(!JSON.stringify(safe).includes('javascript:'));
 assert.ok(!JSON.stringify(safe).includes('onclick'));
});
test('existing plain-text articles remain editable and blank content stays a valid empty document',()=>{
 assert.deepEqual(richTextParagraphs(sectionDocument({paragraphs:['First paragraph','Second paragraph']})),['First paragraph','Second paragraph']);
 assert.deepEqual(normalizeRichText(null),{type:'doc',content:[{type:'paragraph',content:[]}]});
 assert.deepEqual(normalizeRichText({type:'doc',content:[]}),normalizeRichText(null));
});
test('formatted drafts and published snapshots stay independent through storage round trips',()=>{
 const original=post();const live=savePost(initialBlog(),'rich',original,true);
 original.sections[0].richText.content[1].content[0].text='Outside mutation';
 const revised=post();revised.sections[0].richText.content[1].content[0].text='Draft-only revision';
 const drafted=savePost(live,'rich',revised,false);
 const published=visiblePosts(drafted).find(a=>a.slug==='rich-text-guide');
 assert.equal(published.sections[0].richText.content[1].content[0].text,'Start with your questions.');
 assert.deepEqual(readBlog({getItem:()=>JSON.stringify(drafted)}),drafted);
 assert.ok(drafted.records[0].draft.sections[0].paragraphs.includes('Draft-only revision'));
});
test('publish requires meaningful content and descriptions for inline images',()=>{
 const blog=initialBlog();const missing=post();missing.sections[0].richText.content[4].attrs.image.alt=' ';
 assert.ok(validatePost(blog,'rich',missing,true));
 assert.equal(validatePost(blog,'rich',missing,false),'');
 const imageOnly={...post(),sections:[{heading:'Photo guide',paragraphs:[],richText:{type:'doc',content:[{type:'trufitImage',attrs:{image:image(),caption:''}}]}}]};
 assert.equal(validatePost(blog,'rich',imageOnly,true),'');
 const empty={...post(),sections:[{heading:'Empty section',paragraphs:['Stale text'],richText:{type:'doc',content:[{type:'paragraph'}]}}]};
 assert.ok(validatePost(blog,'rich',empty,true));
});
test('search reads rich content and captions rather than stale plain-text copies',()=>{
 const source=[post()];
 assert.equal(filterArticles('searchable checklist entry','All',source).length,1);
 assert.equal(filterArticles('shared starting point','All',source).length,1);
 assert.ok(richTextParagraphs(document()).includes('A numbered step'));
});
test('deeply malformed content is bounded and large sections cannot be silently saved',()=>{
 let node={type:'paragraph',content:[text('deep')]};for(let i=0;i<100;i++)node={type:'blockquote',content:[node]};
 assert.doesNotThrow(()=>normalizeRichText({type:'doc',content:[node]}));
 const big=post();big.sections[0].richText={type:'doc',content:[{type:'paragraph',content:[text('x'.repeat(210000))]}]};
 assert.ok(validatePost(initialBlog(),'rich',big,false));
});
