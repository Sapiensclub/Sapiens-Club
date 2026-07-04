/*
 * Site-wide variables (spec §1). Single source of truth for now — in build
 * stage 4 these become editable in the Sanity CMS (`siteSettings`) and this
 * file turns into the fallback used when the CMS is unreachable.
 */
export const site = {
  name: "Sapiens",
  url: "https://sapiens.club",
  taglineVision:
    "A society where helping each other is the default — not the exception.",
  taglineHook: "The anti-social-network. Built for real life.",
  launchLine: "Launching in India, 2026.",
  contactEmail: "sapiensclub1@gmail.com",
  /*
   * ⚠️ Placeholder (spec §1): the Google Form URL provided was an /edit
   * editor link visitors cannot open. Owner must supply the public share
   * link (Send → link icon → ends in /viewform). Until then: "#".
   */
  volunteerFormUrl: "#",
  instagramUrl: "https://www.instagram.com/sapiens.club_/",
  youtubeUrl: "https://www.youtube.com/channel/UC3k3-4i8uhwbmzCQIZ3NBGA",
  twitterUrl: "https://x.com/Sapiens_Clubb",
  cities: [
    "Pune",
    "Mumbai",
    "Bengaluru",
    "Hyderabad",
    "Delhi NCR",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Indore",
    "Chandigarh",
    "Other",
  ],
} as const;
