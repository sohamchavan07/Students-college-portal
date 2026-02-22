import { COLLEGES, Stream, College } from "../data/colleges";

interface RecommendationInput {
  cutoff: number;
  course: Stream;
  location: string;
  budget: number; // in lakhs
  category: string;
}

interface RecommendationOutput {
  collegeName: string;
  location: string;
  course: string;
  approxFeesPerYear: number;
  collegeCutoff: number;
  studentCutoff: number;
  admissionProbability: string;
  reason: string;
}

function getAdmissionProbability(studentCutoff: number, collegeCutoff: number): string {
  const diff = studentCutoff - collegeCutoff;
  if (diff >= 10) return "High (80–95%)";
  if (Math.abs(diff) <= 5) return "Medium (50–75%)";
  if (diff >= -15 && diff < -5) return "Low (20–45%)";
  return "Very Low (<20%)";
}

export function recommendColleges(input: RecommendationInput): RecommendationOutput[] {
  // Filter colleges by course, location, budget, and cutoff logic
  let filtered = COLLEGES.filter((c) =>
    c.streams.includes(input.course) &&
    (input.location === "Any" || c.location === input.location || c.location === "Any") &&
    c.fees <= input.budget &&
    input.cutoff >= c.minPercentile - 15 // Only consider realistic chances
  );

  // Sort by location preference, then by how close the cutoff is, then by rating
  filtered = filtered.sort((a, b) => {
    // Prioritize preferred location
    if (input.location !== "Any") {
      if (a.location === input.location && b.location !== input.location) return -1;
      if (b.location === input.location && a.location !== input.location) return 1;
    }
    // Then by cutoff closeness (closer is better)
    const diffA = Math.abs(input.cutoff - a.minPercentile);
    const diffB = Math.abs(input.cutoff - b.minPercentile);
    if (diffA !== diffB) return diffA - diffB;
    // Then by rating (higher is better)
    return b.rating - a.rating;
  });

  // Pick top 5
  const top5 = filtered.slice(0, 5);

  // Format output
  return top5.map((c) => {
    const admissionProbability = getAdmissionProbability(input.cutoff, c.minPercentile);
    let reason = "";
    if (admissionProbability.startsWith("High")) reason = "Your cutoff is well above the college's cutoff.";
    else if (admissionProbability.startsWith("Medium")) reason = "Your cutoff closely matches the college's cutoff.";
    else if (admissionProbability.startsWith("Low")) reason = "Your cutoff is slightly below the college's cutoff, but you still have a chance.";
    else reason = "Admission is unlikely, but you may apply as a reach option.";
    if (c.fees > input.budget) reason += " (Budget may not be suitable.)";
    if (input.location !== "Any" && c.location !== input.location) reason += " (Not in preferred location.)";
    if (!c.streams.includes(input.course)) reason += " (Course not available.)";
    return {
      collegeName: c.name,
      location: c.location,
      course: input.course,
      approxFeesPerYear: c.fees,
      collegeCutoff: c.minPercentile,
      studentCutoff: input.cutoff,
      admissionProbability,
      reason,
    };
  });
}
