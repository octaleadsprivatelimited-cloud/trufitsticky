export const articles = [
  {
    slug: 'getting-started-with-a-coach', category: 'Getting started', visual: 'start', featured: true,
    title: 'Your first steps with a fitness coach',
    excerpt: 'From choosing a coach to your first check-in, here’s how to make your next step feel simple.',
    sections: [
      { heading: 'Start with what you need', paragraphs: ['Write down what you want support with and what your week actually looks like. Your experience, available equipment, food preferences, and working hours are useful starting points. You don’t need a perfect routine before speaking to a coach.'] },
      { heading: 'Compare the plans in one place', paragraphs: ['Open a coach’s profile to see their available programs, durations, and total prices. Read the plan inclusions and reviews, then choose individual coaching, couple coaching, or an available consultation. The coach’s story is there when you want more context.'] },
      { heading: 'Know the booking steps', paragraphs: ['Choose your plan, provide your details, and review the payment step. Check the coach, program duration, and total before you pay. For a consultation, check the selected date and time as well.'] },
      { heading: 'Bring your real routine', paragraphs: ['Use your first conversation to explain what is easy to maintain and where you get stuck. Agree on how to share updates and ask questions. A clear starting point gives you and your coach something practical to work from.'] },
    ],
  },
  {
    slug: 'make-room-for-training', category: 'Training', visual: 'calendar',
    title: 'Make room for training in a busy week',
    excerpt: 'A little planning can make your training schedule easier to follow when life gets full.',
    sections: [
      { heading: 'Look at the week you have', paragraphs: ['Before you fill a calendar with workouts, look at work, travel, family commitments, and the time it takes to get to your training space. Share those limits with your coach so your schedule starts with realistic expectations.'] },
      { heading: 'Choose a time and a place', paragraphs: ['A vague intention is easy to move. Pick the windows that usually work for you and agree on a training schedule with your coach. Keep equipment, travel time, and access to your gym in mind.'] },
      { heading: 'Plan for the disrupted day', paragraphs: ['Ask your coach what to do when a meeting runs late or you are away from home. Having an agreed adjustment makes it easier to respond without redesigning the whole week yourself.'] },
      { heading: 'Review what actually happened', paragraphs: ['At your check-in, describe which sessions fit and which did not. Include the practical reason: timing, location, or another commitment. Your calendar is useful feedback, even when the week doesn’t go to plan.'] },
    ],
  },
  {
    slug: 'food-preferences-and-your-plan', category: 'Nutrition', visual: 'plate',
    title: 'Your food preferences belong in the plan',
    excerpt: 'Help your coach understand the meals, preferences, and everyday constraints that matter to you.',
    sections: [
      { heading: 'Describe an ordinary day', paragraphs: ['Think through what you usually eat on a working day and on a day off. Include meals away from home, who prepares your food, and when you normally get a chance to eat. This gives your coach more context than a list of favorite foods alone.'] },
      { heading: 'Make preferences clear', paragraphs: ['Tell your coach about foods you enjoy, foods you avoid, cultural preferences, and any dietary restrictions. If you have allergies or medical dietary requirements, explain them clearly and involve your treating clinician where needed.'] },
      { heading: 'Include the practical details', paragraphs: ['Your cooking facilities, shopping options, budget, and time are all part of the conversation. A plan is easier to discuss when your coach understands what is available to you.'] },
      { heading: 'Keep the conversation open', paragraphs: ['If a meal suggestion does not fit your routine or preferences, say so at your check-in. Ask about alternatives instead of guessing at substitutions. These notes are a useful starting point for a conversation, rather than a diet prescription.'] },
    ],
  },
  {
    slug: 'compare-coaching-programs', category: 'Getting started', visual: 'plans',
    title: 'How to compare coaching programs',
    excerpt: 'Look beyond the headline price and understand the support, timeline, and booking details.',
    sections: [
      { heading: 'Compare the total and the timeline', paragraphs: ['Check the full program price and how long the coaching lasts. When comparing two durations, keep the total commitment in view rather than choosing from a weekly equivalent alone. Available durations and prices appear on each coach’s profile.'] },
      { heading: 'Read what is included', paragraphs: ['Look for the training guidance, nutrition support, and check-in arrangements described in the plan. If something matters to you and is not clear, ask before booking. Avoid assuming that every program has exactly the same inclusions.'] },
      { heading: 'Choose the right format', paragraphs: ['Individual coaching focuses on one person. Couple coaching lets two people start together while keeping individual goals in the conversation. A consultation, when offered, can be a smaller first step for discussing your questions.'] },
      { heading: 'Review before payment', paragraphs: ['Confirm your coach, chosen program, personal details, and total. Read the relevant terms and refund policy before completing a purchase. Keep your booking confirmation and invoice somewhere easy to find.'] },
    ],
  },
  {
    slug: 'make-your-check-in-useful', category: 'Coaching', visual: 'checkin',
    title: 'A check-in that helps your coach help you',
    excerpt: 'Share the small details that explain your week and make the next conversation more useful.',
    sections: [
      { heading: 'Start with what happened', paragraphs: ['You don’t need a polished report. Explain what you completed, what you missed, and what changed during the week. A short, honest update gives your coach a clearer picture than trying to make every week sound successful.'] },
      { heading: 'Add the reason', paragraphs: ['Mention practical obstacles such as travel, a changed shift, equipment access, or a meal suggestion that was difficult to prepare. These details help turn a general problem into something you can discuss together.'] },
      { heading: 'Bring your questions', paragraphs: ['Keep a note of questions as they come up. Ask for clarification when instructions are unclear, and tell your coach if something feels uncomfortable instead of waiting for the next scheduled update.'] },
      { heading: 'Leave with a clear next step', paragraphs: ['At the end of your check-in, confirm any agreed changes and what to focus on next. Keep those notes somewhere you can revisit. The goal is a useful conversation that connects this week to the next one.'] },
    ],
  },
  {
    slug: 'starting-couple-coaching', category: 'Coaching', visual: 'together',
    title: 'Coaching for two, with room for each of you',
    excerpt: 'A shared start can still leave space for different goals, preferences, and schedules.',
    sections: [
      { heading: 'Talk about your separate goals', paragraphs: ['Starting together does not mean wanting the same thing. Each person should explain their own experience, priorities, and expectations. Write these down separately before comparing notes, so neither person’s needs disappear into a shared goal.'] },
      { heading: 'Share the overlap and the differences', paragraphs: ['Tell your coach when you can train together and when your schedules differ. Include differences in equipment access, food preferences, and day-to-day routines. These details are useful when discussing how your individual plans can fit into a shared household.'] },
      { heading: 'Agree on useful support', paragraphs: ['Ask each other what kind of encouragement helps. Some people enjoy a shared calendar; others prefer a quick conversation at the end of the week. Avoid assuming that the same reminder will work for both of you.'] },
      { heading: 'Check the booking details', paragraphs: ['Choose the couple option on your coach’s profile to see available programs and prices. Review what the package includes and provide the requested details for both people before payment. Ask your coach about anything that is unclear.'] },
    ],
  },
];
export const categories = ['All', 'Getting started', 'Training', 'Nutrition', 'Coaching'];
export function filterArticles(query = '', category = 'All') {
  const term = query.trim().toLowerCase();
  return articles.filter(article => (category === 'All' || article.category === category) &&
    [article.title, article.excerpt, article.category, ...article.sections.flatMap(s => [s.heading, ...s.paragraphs])].join(' ').toLowerCase().includes(term));
}
export function readMinutes(article) {
  const words = [article.title, article.excerpt, ...article.sections.flatMap(s => [s.heading, ...s.paragraphs])].join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
export function relatedArticles(slug) {
  const current = articles.find(a => a.slug === slug);
  return articles.filter(a => a.slug !== slug).sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category)).slice(0, 3);
}
export const blogSeoPages = {
  '/blog': { title: 'The Tru Fit journal — Coaching & Everyday Fitness | Tru Fit', heading: 'Small reads. Forward steps.', description: 'Practical Tru Fit guides to getting started with a coach, planning your training week, and making your preferences part of your coaching plan.' },
  ...Object.fromEntries(articles.map(a => ['/blog/' + a.slug, {title: a.title + ' | Tru Fit journal', heading: a.title, description: a.excerpt, articleSections: a.sections}])),
};
