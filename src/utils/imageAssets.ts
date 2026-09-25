const webpImages = import.meta.glob<string>(
  '../assets/images/**/*.{png,jpg,jpeg,webp}',
  {
    query: { format: 'webp', quality: 85 },
    import: 'default',
    eager: true,
  }
);

const imageMap = new Map<string, string>();

for (const [path, url] of Object.entries(webpImages)) {
  const name = path.split('/').pop()?.replace(/\.[^.]+$/, '').toLowerCase();
  if (name) imageMap.set(name, url);
}

export function getImageUrl(pathOrName?: string | null): string {
  if (!pathOrName) return '';
  const name = pathOrName.split('/').pop()?.replace(/\.[^.]+$/, '').trim().toLowerCase() || '';
  return imageMap.get(name) || pathOrName;
}

export default getImageUrl;
