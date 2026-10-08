import './coachSpecialties.css';

export default function CoachSpecialties({ value }) {
  const specialties = [...new Set((Array.isArray(value) ? value : String(value || '').split(/[,;\n]/))
    .map(item => String(item).trim()).filter(Boolean))];
  if (!specialties.length) return null;

  return (
    <div className="coach-specialties">
      <span className="coach-specialties-label">Specializes in</span>
      <ul className="coach-specialties-list" aria-label="Coach specializations">
        {specialties.map(specialty => <li key={specialty}>{specialty}</li>)}
      </ul>
    </div>
  );
}
