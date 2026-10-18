import test from 'node:test';
import assert from 'node:assert/strict';
import { assignedCustomers, assignCoach } from './coaches.mjs';
const customers=[{id:'a',coach:'Jaswant Medidi'},{id:'b',coach:'Srikar Peddapally'}];
test('coach previews show only assigned sample customers including reassignment',()=>{
 const initial={diets:{a:{draft:{title:'Keep this plan'}}},products:[]};
 assert.deepEqual(assignedCustomers(customers,initial,'jaswant-medidi').map(c=>c.id),['a']);
 const next=assignCoach(initial,'a','srikar-peddapally',customers);
 assert.equal(assignedCustomers(customers,next,'jaswant-medidi').length,0);
 assert.deepEqual(assignedCustomers(customers,next,'srikar-peddapally').map(c=>c.id),['a','b']);
 assert.deepEqual(next.diets,initial.diets);
 assert.equal(initial.assignments,undefined);
});
test('unknown coaches and customer IDs cannot gain sample assignments',()=>{
 assert.deepEqual(assignedCustomers(customers,{},'unknown'),[]);
 assert.throws(()=>assignCoach({},'missing','jaswant-medidi',customers));
 assert.throws(()=>assignCoach({},'a','unknown',customers));
});
