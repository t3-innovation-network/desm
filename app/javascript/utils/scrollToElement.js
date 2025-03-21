export function scrollToElement(hash, buildElementId) {
  if (hash) {
    const elementId = buildElementId(hash.slice(1));
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
