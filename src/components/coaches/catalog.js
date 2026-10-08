import previewData from './coachData';
export const coachSlug = coach => coach.profile_slug || coach.name.toLowerCase().replace(/\s+/g, '');
export const previewCoaches = import.meta.env.DEV ? previewData.map(c => ({
 id: `preview-${c.id}`, name: c.name, image: c.image, profile_slug: coachSlug(c), coach_level: c.coachLevel.toLowerCase(), coach_level_name: c.coachLevel,
 tags: Object.values(c.tags).join(','), tagline: c.tagline, previous_work: c.previously, bio: c.details.personal_journey, unique_approach: c.details.unique_approach,
 specializations: c.details.specializations, certifications: c.details.certifications, experience: c.details.experience, location: c.details.location,
 preview: true, domestic_consultation_enabled: false, international_consultation_enabled: false
})) : [];
export const listFrom = data => Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
export async function fetchCatalog(endpoint, signal){
 try {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin_functions/${endpoint}/`, { signal });
  if(!response.ok) throw new Error('The coaching catalogue is temporarily unavailable.');
  return listFrom(await response.json());
 } catch(error) {
  if(error.name === 'AbortError' || !import.meta.env.DEV) throw error;
  const response = await fetch(`/catalog-preview/admin_functions/${endpoint}/`, {signal});
  if(!response.ok) throw error;
  const rows = listFrom(await response.json());
  return endpoint === 'coach-profiles' ? rows.map(c=>({...c,preview:true,livePreview:true})) : rows;
 }
}
