// Deliberately inert. Future integrations belong here and nowhere else.
export function initializeOptionalIntegrations(config={}){
  if(config.analyticsId||config.adsenseClient)console.warn('Optional integrations are configured but not implemented.');
}
