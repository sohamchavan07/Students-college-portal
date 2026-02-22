const { recommendColleges } = require("../lib/recommendColleges.cjs");

// Example test input
const testInput = {
  cutoff: 88,
  course: "Computer Science",
  location: "Pune",
  budget: 4,
  category: "General"
};

console.log(JSON.stringify(recommendColleges(testInput), null, 2));
