"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendColleges = recommendColleges;
var colleges_1 = require("../data/colleges");
function getAdmissionProbability(studentCutoff, collegeCutoff) {
    var diff = studentCutoff - collegeCutoff;
    if (diff >= 10)
        return "High (80–95%)";
    if (Math.abs(diff) <= 5)
        return "Medium (50–75%)";
    if (diff >= -15 && diff < -5)
        return "Low (20–45%)";
    return "Very Low (<20%)";
}
function recommendColleges(input) {
    // Filter colleges by course, location, budget, and cutoff logic
    var filtered = colleges_1.COLLEGES.filter(function (c) {
        return c.streams.includes(input.course) &&
            (input.location === "Any" || c.location === input.location || c.location === "Any") &&
            c.fees <= input.budget &&
            input.cutoff >= c.minPercentile - 15;
    } // Only consider realistic chances
    );
    // Sort by location preference, then by how close the cutoff is, then by rating
    filtered = filtered.sort(function (a, b) {
        // Prioritize preferred location
        if (input.location !== "Any") {
            if (a.location === input.location && b.location !== input.location)
                return -1;
            if (b.location === input.location && a.location !== input.location)
                return 1;
        }
        // Then by cutoff closeness (closer is better)
        var diffA = Math.abs(input.cutoff - a.minPercentile);
        var diffB = Math.abs(input.cutoff - b.minPercentile);
        if (diffA !== diffB)
            return diffA - diffB;
        // Then by rating (higher is better)
        return b.rating - a.rating;
    });
    // Pick top 5
    var top5 = filtered.slice(0, 5);
    // Format output
    return top5.map(function (c) {
        var admissionProbability = getAdmissionProbability(input.cutoff, c.minPercentile);
        var reason = "";
        if (admissionProbability.startsWith("High"))
            reason = "Your cutoff is well above the college's cutoff.";
        else if (admissionProbability.startsWith("Medium"))
            reason = "Your cutoff closely matches the college's cutoff.";
        else if (admissionProbability.startsWith("Low"))
            reason = "Your cutoff is slightly below the college's cutoff, but you still have a chance.";
        else
            reason = "Admission is unlikely, but you may apply as a reach option.";
        if (c.fees > input.budget)
            reason += " (Budget may not be suitable.)";
        if (input.location !== "Any" && c.location !== input.location)
            reason += " (Not in preferred location.)";
        if (!c.streams.includes(input.course))
            reason += " (Course not available.)";
        return {
            collegeName: c.name,
            location: c.location,
            course: input.course,
            approxFeesPerYear: c.fees,
            collegeCutoff: c.minPercentile,
            studentCutoff: input.cutoff,
            admissionProbability: admissionProbability,
            reason: reason,
        };
    });
}
