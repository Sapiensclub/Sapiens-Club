import { getCampaignBanner } from "@/sanity/content";
import { CampaignBannerClient } from "./campaign-banner-client";

/*
 * Campaign banner (owner request, July 2026): promotional banner at the
 * very top of the homepage, fully editable in the studio ("Campaign
 * banner" singleton), hidden unless enabled. Server half — fetches the
 * document; the client half handles the homepage-only gate, the date
 * window and dismissal.
 */
export async function CampaignBanner() {
  const banner = await getCampaignBanner();
  if (!banner || !banner.enabled || !banner.headline) return null;
  return <CampaignBannerClient banner={banner} />;
}
