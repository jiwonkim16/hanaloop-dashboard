import { companies, posts, countries } from "./data";
import type { Company, Post, Country } from "./types";

// Simulate network latency and occasional failures
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const jitter = () => 200 + Math.random() * 600;
const maybeFail = () => Math.random() < 0.15;

const _countries = [...countries];
const _companies = [...companies];
let _posts = [...posts];

export async function fetchCountries(): Promise<Country[]> {
  await delay(jitter());
  return _countries;
}

export async function fetchCompanies(): Promise<Company[]> {
  await delay(jitter());
  return _companies;
}

export async function fetchPosts(): Promise<Post[]> {
  await delay(jitter());
  return _posts;
}

export async function createOrUpdatePost(
  p: Omit<Post, "id"> & { id?: string },
): Promise<Post> {
  await delay(jitter());
  if (maybeFail()) throw new Error("Save failed");

  if (p.id) {
    _posts = _posts.map((x) => (x.id === p.id ? (p as Post) : x));
    return p as Post;
  }

  const created = { ...p, id: crypto.randomUUID() };
  _posts = [..._posts, created];
  return created;
}

// Additional utility functions for dashboard
export function calculateTotalEmissions(company: Company): number {
  return company.emissions.reduce(
    (total, emission) => total + emission.emissions,
    0,
  );
}

export function calculateCarbonTax(
  company: Company,
  countries: Country[],
): number {
  const country = countries.find((c) => c.code === company.country);
  if (!country) return 0;

  const totalEmissions = calculateTotalEmissions(company);
  return totalEmissions * country.carbonTaxRate;
}

export function convertEmissionsToTrees(emissions: number): number {
  // Average tree absorbs about 48 pounds (0.024 tons) of CO2 per year
  return Math.round(emissions / 0.024);
}
