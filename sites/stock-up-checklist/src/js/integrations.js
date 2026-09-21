// Reserved for explicitly enabled, site-local integrations. Both are disabled by default.
const config=window.SITE_CONFIG||{};export const integrations={analyticsEnabled:Boolean(config.analyticsId),adsEnabled:Boolean(config.adsenseClient)};
