export function scenarioFromUrl(search,scenarioById){const params=new URLSearchParams(search);const value=params.get('for');return value&&/^[a-z0-9-]+$/.test(value)&&scenarioById.has(value)?value:null}
export function scenarioUrl(id,locationObject=location){const url=new URL(locationObject.href);url.search='';url.searchParams.set('for',id);url.hash='';return url}
