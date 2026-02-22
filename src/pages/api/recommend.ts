import type { NextApiRequest, NextApiResponse } from "next";
import { recommendColleges } from "../../lib/recommendColleges";
import { Stream } from "../../data/colleges";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const { cutoff, course, location, budget, category } = req.body;
  if (
    typeof cutoff !== "number" ||
    typeof course !== "string" ||
    typeof location !== "string" ||
    typeof budget !== "number" ||
    typeof category !== "string"
  ) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const recommendations = recommendColleges({
    cutoff,
    course: course as Stream,
    location,
    budget,
    category,
  });
  res.status(200).json(recommendations);
}
