import fs from 'fs';
import path from 'path';

export const setNestedValue = async (
  translations,
  category,
  fullPath,
  newText,
  localesDir,
  lang,
) => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const pathParts = fullPath.split('.');
  let current = translations[category];

  for (let i = 0; i < pathParts.length - 1; i++) {
    current = current[pathParts[i]];
  }

  current[pathParts[pathParts.length - 1]] = newText;

  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
};
