import path from 'node:path';

export default {
  'apps/app/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}': (files) => [`pnpm --dir apps/app exec eslint ${files.map((file) => JSON.stringify(path.relative('apps/app', file))).join(' ')}`],

  'apps/website/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}': (files) => [`pnpm --dir apps/website exec eslint ${files.map((file) => JSON.stringify(path.relative('apps/website', file))).join(' ')}`],

  '*.{json,md,mdx,css,scss,yml,yaml}': 'prettier --check',
};
