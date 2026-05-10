const defaultSiteUrl = "https://mehditrari.com";

function normalizeSiteUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl;
  return normalizeSiteUrl(configuredUrl);
}

export const siteConfig = {
  name: "Mehdi Trari",
  title: "Mehdi Trari | Portfolio",
  description:
    "Portfolio de Mehdi Trari, développeur full-stack orienté back-end PHP/Symfony avec une culture cyber et AppSec.",
  location: "Lille, France",
  canonicalHost: "mehditrari.com",
  siteUrl: getSiteUrl(),
};
