import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://zipgapsai.local";
  return [
    "",
    "/calculator/acquisition-tax",
    "/search",
    "/pricing",
    "/faq",
    "/legal/disclaimer",
    "/policies"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7
  }));
}
