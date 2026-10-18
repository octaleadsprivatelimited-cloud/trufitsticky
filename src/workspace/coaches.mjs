export const workspaceCoaches = [
  {slug:'jaswant-medidi',name:'Jaswant Medidi',initials:'JM'},
  {slug:'srikar-peddapally',name:'Srikar Peddapally',initials:'SP'},
];
export function assignedCustomers(customers, workspace, coachSlug) {
  const coach = workspaceCoaches.find(c=>c.slug === coachSlug);
  return coach ? customers.filter(c=>(workspace.assignments?.[c.id] || c.coach) === coach.name) : [];
}
export function assignCoach(workspace, customerId, coachSlug, customers) {
  const coach = workspaceCoaches.find(c=>c.slug === coachSlug);
  if (!coach || !customers.some(c=>c.id === customerId)) throw new Error('Choose an existing customer and coach.');
  return {...workspace,assignments:{...workspace.assignments,[customerId]:coach.name}};
}
