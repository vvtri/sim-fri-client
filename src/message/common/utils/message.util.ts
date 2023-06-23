export function openCallWindow(url: string) {
  const width = (window.innerWidth / 100) * 80;
  const height = (window.innerHeight / 100) * 80;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const strWindowFeatures = `height=${height},width=${width},scrollbars=yes,status=yes,left=${left},top=${top}`;

  window.open(url, '_blank', strWindowFeatures);
}
