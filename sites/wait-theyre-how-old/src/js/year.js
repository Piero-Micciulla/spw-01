export function renderCurrentYear(root=document){const year=String(new Date().getFullYear());for(const element of root.querySelectorAll('[data-current-year]'))element.textContent=year}
renderCurrentYear();
