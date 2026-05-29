export function makeChapterLoader(baseUrl, lang) {
  const fallback = lang === 'fr' ? 'en' : 'fr';

  return async function loadChapter(name) {
    const tryImport = (l) => import(new URL(`./content/${name}.${l}.js`, baseUrl).href);
    try {
      return (await tryImport(lang)).default;
    } catch {
      try {
        const mod = await tryImport(fallback);
        return mod.default;
      } catch (err) {
        throw new Error(
          `Chapter "${name}" not found in either ${lang} or ${fallback} (${err.message})`,
        );
      }
    }
  };
}
