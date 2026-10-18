import test from 'node:test';
import assert from 'node:assert/strict';
import { initialBlog, blankPost, savePost, unpublishPost, visiblePosts, validatePost, postStatus, readBlog, slugify } from './store.mjs';
const post=()=>({...blankPost(),title:'A practical start',slug:'a-practical-start',excerpt:'Prepare for your first coaching conversation.',sections:[{heading:'Make a note',paragraphs:['Write down your questions.']}]});
test('new drafts stay out of the blog until explicitly published',()=>{
 const initial=initialBlog();const draft=savePost(initial,'test',post());
 assert.equal(visiblePosts(draft).length,visiblePosts(initial).length);
 assert.equal(postStatus(draft.records[0]),'Draft');
 const published=savePost(draft,'test',post(),true);
 assert.equal(visiblePosts(published).find(a=>a.slug===post().slug).title,post().title);
 assert.equal(postStatus(published.records[0]),'Published');
 assert.equal(initial.records.length+1,published.records.length);
});
test('editing a published draft keeps its prior published snapshot',()=>{
 const original=post();const live=savePost(initialBlog(),'test',original,true);
 original.sections[0].paragraphs[0]='Mutated externally';
 const revised={...post(),title:'A revised start'};
 const draft=savePost(live,'test',revised);
 assert.equal(visiblePosts(draft).find(a=>a.slug===post().slug).title,'A practical start');
 assert.equal(draft.records[0].published.sections[0].paragraphs[0],'Write down your questions.');
 assert.equal(postStatus(draft.records[0]),'Unpublished changes');
 const unpublished=unpublishPost(draft,'test');
 assert.ok(!visiblePosts(unpublished).some(a=>a.slug===post().slug));
 assert.equal(unpublished.records[0].draft.title,'A revised start');
});
test('publish rejects incomplete content, duplicate URLs, and unsafe slugs',()=>{
 const blog=initialBlog();
 for(const override of [{title:' '},{slug:'../unsafe'},{slug:'getting-started-with-a-coach'},{excerpt:' '},{sections:[]},{sections:[{heading:'',paragraphs:['Body']}]},{sections:[{heading:'Title',paragraphs:[' ']}]},{visual:'unknown'},{category:'unknown'}]) assert.ok(validatePost(blog,'new',{...post(),...override},true));
 assert.throws(()=>savePost(blog,'new',{...post(),excerpt:''},true));
 const original=blog.records[0];
 assert.ok(validatePost(blog,original.id,{...original.draft,slug:'changed-url'},true));
});
test('one featured post is published at a time and drafts cannot change the featured guide',()=>{
 const blog=initialBlog();const draft=savePost(blog,'new',{...post(),featured:true});
 assert.equal(visiblePosts(draft).filter(a=>a.featured).length,1);
 assert.equal(visiblePosts(draft).find(a=>a.featured).slug,'getting-started-with-a-coach');
 const next=savePost(draft,'new',{...post(),featured:true},true);
 assert.deepEqual(visiblePosts(next).filter(a=>a.featured).map(a=>a.slug),['a-practical-start']);
});
test('missing, corrupted, and unavailable storage fall back to the original guides',()=>{
 for(const value of [null,'broken','{}','{"version":1,"records":[{}]}']) assert.equal(readBlog({getItem:()=>value}).records.length,initialBlog().records.length);
 assert.equal(readBlog({getItem:()=>{throw Error('blocked');}}).records.length,initialBlog().records.length);
 const blog=savePost(initialBlog(),'test',post());
 assert.deepEqual(readBlog({getItem:()=>JSON.stringify(blog)}),blog);
 assert.equal(slugify('  Your Next Step!  '),'your-next-step');
});
test('unpublishing keeps a previously published URL stable',()=>{
 const live=savePost(initialBlog(),'test',post(),true);
 const unpublished=unpublishPost(live,'test');
 assert.ok(validatePost(unpublished,'test',{...post(),slug:'another-url'},false));
});
