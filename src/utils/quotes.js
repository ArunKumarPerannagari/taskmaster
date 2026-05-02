// Motivational quotes for productivity
export const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
  { text: "Small steps every day lead to big results.", author: "Unknown" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Productivity is never an accident. It is always the result of commitment to excellence.", author: "Paul J. Meyer" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" },
  { text: "If you spend too much time thinking about a thing, you'll never get it done.", author: "Bruce Lee" },
];

export const PRODUCTIVITY_TIPS = [
  "Try the Pomodoro Technique: 25 min work, 5 min break.",
  "Start with your hardest task — your brain is sharpest early.",
  "Batch similar tasks together to reduce context switching.",
  "Keep your workspace clean to minimize distractions.",
  "Write down tomorrow's top 3 tasks before you sleep.",
  "Turn off notifications during deep work sessions.",
  "Review your tasks every morning to stay on track.",
  "Break large tasks into smaller, actionable steps.",
  "Use deadlines to create urgency and beat procrastination.",
  "Celebrate small wins — momentum is powerful!",
];

export const getRandomQuote = () =>
  QUOTES[Math.floor(Math.random() * QUOTES.length)];

export const getDailyQuote = () => {
  const dayIndex = new Date().getDay();
  return QUOTES[dayIndex % QUOTES.length];
};

export const getDailyTip = () => {
  const dayIndex = new Date().getDate();
  return PRODUCTIVITY_TIPS[dayIndex % PRODUCTIVITY_TIPS.length];
};
