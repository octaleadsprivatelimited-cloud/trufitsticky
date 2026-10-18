import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCoverFile, coverDimensions, validCoverImage, MAX_COVER_BYTES } from './images.mjs';
import { initialBlog, blankPost, savePost, validatePost, visiblePosts } from './store.mjs';
const cover=(id='cover-one')=>({id,name:'training.webp',alt:'People preparing for a workout',width:1200,height:800});
const post=()=>({...blankPost(),title:'Cover preview',slug:'cover-preview',excerpt:'A test post.',sections:[{heading:'Start here',paragraphs:['A test paragraph.']}],coverImage:cover()});
test('cover upload accepts supported image types and rejects oversized, empty, and unsupported files',()=>{
 for(const type of ['image/jpeg','image/png','image/webp']) assert.equal(validateCoverFile({type,size:1024}), '');
 for(const file of [{type:'image/svg+xml',size:1024},{type:'text/plain',size:10},{type:'image/png',size:0},{type:'image/jpeg',size:MAX_COVER_BYTES+1}]) assert.ok(validateCoverFile(file));
});
test('cover resizing preserves aspect ratio without enlarging small images',()=>{
 assert.deepEqual(coverDimensions(4000,3000),{width:1600,height:1200});
 assert.deepEqual(coverDimensions(1200,2400),{width:800,height:1600});
 assert.deepEqual(coverDimensions(300,200),{width:300,height:200});
 assert.throws(()=>coverDimensions(0,20));
 assert.throws(()=>coverDimensions(NaN,20));
});
test('saved image references require valid browser asset metadata and publishing requires alt text',()=>{
 assert.ok(validCoverImage(cover()));
 assert.ok(validCoverImage(null));
 for(const override of [{id:'https://example.com/image'},{width:0},{height:20000},{alt:123},{name:'x'.repeat(256)}]) assert.equal(validCoverImage({...cover(),...override}),false);
 assert.ok(validatePost(initialBlog(),'test',{...post(),coverImage:{...cover(),alt:' '}},true));
 assert.equal(validatePost(initialBlog(),'test',{...post(),coverImage:{...cover(),alt:''}},false),'');
});
test('cover replacements and removal stay in draft until published, without embedding image bytes',()=>{
 const live=savePost(initialBlog(),'test',post(),true);
 const replacement={...post(),coverImage:cover('cover-two')};
 const draft=savePost(live,'test',replacement,false);
 assert.equal(visiblePosts(draft).find(a=>a.slug==='cover-preview').coverImage.id,'cover-one');
 const updated=savePost(draft,'test',replacement,true);
 assert.equal(visiblePosts(updated).find(a=>a.slug==='cover-preview').coverImage.id,'cover-two');
 const removed=savePost(updated,'test',{...replacement,coverImage:null},true);
 assert.equal(visiblePosts(removed).find(a=>a.slug==='cover-preview').coverImage,null);
 assert.ok(!JSON.stringify(updated).includes('data:image'));
 assert.equal(validatePost(initialBlog(),'test',{...post(),coverImage:null},true),'');
});
