export type Stream =
  | "Computer Science"
  | "Information Technology"
  | "Mechanical Engineering"
  | "Electronics & Communication"
  | "Civil Engineering"
  | "MBA"
  | "Electrical Engineering"
  | "Chemical Engineering";

export type CollegeType = "private" | "govt";

export interface College {
  id: number;
  name: string;
  location: string;
  streams: Stream[];
  minPercentile: number;
  fees: number; // annual, in lakhs (e.g. 2.5 = ₹2.5L)
  rating: number; // 1-5
  type: CollegeType;
  established: number;
}

export const COLLEGES: College[] = [
  {
    id: 1,
    name: "VIT University",
    location: "Pune",
    streams: ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Communication"],
    minPercentile: 85,
    fees: 3.5,
    rating: 4.5,
    type: "private",
    established: 1984,
  },
  {
    id: 2,
    name: "BITS Pilani",
    location: "Hyderabad",
    streams: ["Computer Science", "Electronics & Communication", "Mechanical Engineering", "Chemical Engineering"],
    minPercentile: 95,
    fees: 5.5,
    rating: 5,
    type: "private",
    established: 1964,
  },
  {
    id: 3,
    name: "Symbiosis Institute of Technology",
    location: "Pune",
    streams: ["Computer Science", "Information Technology", "Civil Engineering", "Mechanical Engineering"],
    minPercentile: 75,
    fees: 2.8,
    rating: 4,
    type: "private",
    established: 2008,
  },
  {
    id: 4,
    name: "Manipal Institute of Technology",
    location: "Bangalore",
    streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering"],
    minPercentile: 80,
    fees: 4.2,
    rating: 4.5,
    type: "private",
    established: 1957,
  },
  {
    id: 5,
    name: "SRM Institute of Science and Technology",
    location: "Chennai",
    streams: ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    minPercentile: 70,
    fees: 2.2,
    rating: 4,
    type: "private",
    established: 1985,
  },
  {
    id: 6,
    name: "College of Engineering Pune (COEP)",
    location: "Pune",
    streams: ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication", "Electrical Engineering"],
    minPercentile: 90,
    fees: 0.8,
    rating: 4.5,
    type: "govt",
    established: 1854,
  },
  {
    id: 7,
    name: "IIT Bombay (MTech)",
    location: "Mumbai",
    streams: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering"],
    minPercentile: 99,
    fees: 0.5,
    rating: 5,
    type: "govt",
    established: 1958,
  },
  {
    id: 8,
    name: "Thadomal Shahani Engineering College",
    location: "Mumbai",
    streams: ["Computer Science", "Information Technology", "Electronics & Communication"],
    minPercentile: 65,
    fees: 1.4,
    rating: 3.5,
    type: "private",
    established: 1983,
  },
  {
    id: 9,
    name: "Amity University",
    location: "Delhi",
    streams: ["Computer Science", "Information Technology", "MBA", "Mechanical Engineering", "Civil Engineering"],
    minPercentile: 60,
    fees: 2.5,
    rating: 3.5,
    type: "private",
    established: 2005,
  },
  {
    id: 10,
    name: "Delhi Technological University",
    location: "Delhi",
    streams: ["Computer Science", "Electronics & Communication", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    minPercentile: 92,
    fees: 0.9,
    rating: 4.5,
    type: "govt",
    established: 1941,
  },
  {
    id: 11,
    name: "RV College of Engineering",
    location: "Bangalore",
    streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering"],
    minPercentile: 85,
    fees: 1.5,
    rating: 4,
    type: "private",
    established: 1963,
  },
  {
    id: 12,
    name: "PSG College of Technology",
    location: "Chennai",
    streams: ["Computer Science", "Mechanical Engineering", "Electronics & Communication", "Civil Engineering", "Electrical Engineering"],
    minPercentile: 80,
    fees: 1.2,
    rating: 4,
    type: "private",
    established: 1951,
  },
  {
    id: 13,
    name: "Osmania University",
    location: "Hyderabad",
    streams: ["Computer Science", "Civil Engineering", "Mechanical Engineering", "Chemical Engineering", "MBA"],
    minPercentile: 65,
    fees: 0.6,
    rating: 3.5,
    type: "govt",
    established: 1918,
  },
  {
    id: 14,
    name: "NMIMS University",
    location: "Mumbai",
    streams: ["MBA", "Computer Science", "Information Technology"],
    minPercentile: 78,
    fees: 6,
    rating: 4.5,
    type: "private",
    established: 1981,
  },
  {
    id: 15,
    name: "Pune Institute of Computer Technology",
    location: "Pune",
    streams: ["Computer Science", "Information Technology", "Electronics & Communication"],
    minPercentile: 72,
    fees: 1.1,
    rating: 3.5,
    type: "private",
    established: 1983,
  },
  {
    id: 16,
    name: "PES University",
    location: "Bangalore",
    streams: ["Computer Science", "Electrical Engineering", "Electronics & Communication", "Mechanical Engineering", "MBA"],
    minPercentile: 82,
    fees: 3,
    rating: 4,
    type: "private",
    established: 1972,
  },
  {
    id: 17,
    name: "IIM Ahmedabad (MBA)",
    location: "Any",
    streams: ["MBA"],
    minPercentile: 99,
    fees: 12,
    rating: 5,
    type: "govt",
    established: 1961,
  },
  {
    id: 18,
    name: "Lovely Professional University",
    location: "Delhi",
    streams: ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "MBA"],
    minPercentile: 55,
    fees: 1.8,
    rating: 3,
    type: "private",
    established: 2005,
  },
];

export const STREAMS: Stream[] = [
  "Computer Science",
  "Information Technology",
  "Mechanical Engineering",
  "Electronics & Communication",
  "Civil Engineering",
  "MBA",
  "Electrical Engineering",
  "Chemical Engineering",
];

export const LOCATIONS = [
  "Any",
  "Mumbai",
  "Pune",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
];

export type BudgetRange = "under1" | "1to3" | "3to5" | "5plus";

export const BUDGET_RANGES: { value: BudgetRange; label: string; max: number }[] = [
  { value: "under1", label: "Under ₹1L / year", max: 1 },
  { value: "1to3", label: "₹1L – ₹3L / year", max: 3 },
  { value: "3to5", label: "₹3L – ₹5L / year", max: 5 },
  { value: "5plus", label: "₹5L+ / year", max: Infinity },
];

export interface StudentProfile {
  percentile: number;
  stream: Stream;
  location: string;
  budget: BudgetRange;
}

export type MatchLabel = "Safe" | "Good Match" | "Reach";

export function getMatchLabel(studentPercentile: number, collegeMinPercentile: number): MatchLabel {
  const gap = studentPercentile - collegeMinPercentile;
  if (gap >= 10) return "Safe";
  if (gap >= 0) return "Good Match";
  return "Reach";
}

export function filterColleges(profile: StudentProfile): College[] {
  const budgetMax = BUDGET_RANGES.find((b) => b.value === profile.budget)?.max ?? Infinity;

  return COLLEGES.filter((c) => {
    const percentileOk = profile.percentile >= c.minPercentile;
    const streamOk = c.streams.includes(profile.stream);
    const locationOk = profile.location === "Any" || c.location === profile.location || c.location === "Any";
    const budgetOk = c.fees <= budgetMax;
    return percentileOk && streamOk && locationOk && budgetOk;
  });
}

export type SortOption = "rating" | "fees-asc" | "fees-desc";

export function sortColleges(colleges: College[], sort: SortOption): College[] {
  return [...colleges].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "fees-asc") return a.fees - b.fees;
    if (sort === "fees-desc") return b.fees - a.fees;
    return 0;
  });
}

export interface ClientFilters {
  name?: string;
  minRating?: number; // 0-5
  type?: "any" | CollegeType;
}

export function applyClientFilters(colleges: College[], filters: ClientFilters): College[] {
  const name = (filters.name ?? "").trim().toLowerCase();
  const minRating = filters.minRating ?? 0;
  const type = filters.type ?? "any";

  return colleges.filter((c) => {
    if (name && !c.name.toLowerCase().includes(name)) return false;
    if (c.rating < minRating) return false;
    if (type !== "any" && c.type !== type) return false;
    return true;
  });
}
