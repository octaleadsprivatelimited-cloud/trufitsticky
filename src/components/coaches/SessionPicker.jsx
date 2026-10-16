import { useState } from 'react';
import { sampleDates, sampleTimes } from '../../portal/booking.mjs';
import { formatDate } from '../../portal/data.mjs';
import '../../styles/member-access.css';

export default function SessionPicker({ slot, onChange }) {
  const [dates] = useState(sampleDates);
  return <fieldset className="member-session-picker"><legend>Your first session</legend><p id="session-preview-note">Sample times only · India Standard Time (UTC+05:30). No live availability or reservation.</p><div><label htmlFor="session-date">Session date<select id="session-date" value={slot.date} onChange={event => onChange({ ...slot, date: event.target.value })} required aria-describedby="session-preview-note"><option value="">Choose a date</option>{dates.map(date => <option key={date} value={date}>{formatDate(date)}</option>)}</select></label><label htmlFor="session-time">Time slot<select id="session-time" value={slot.time} onChange={event => onChange({ ...slot, time: event.target.value })} required aria-describedby="session-preview-note"><option value="">Choose a time</option>{sampleTimes.map(time => <option key={time.value} value={time.value}>{time.label}</option>)}</select></label></div><small>20-minute welcome call with your coach.</small></fieldset>;
}
