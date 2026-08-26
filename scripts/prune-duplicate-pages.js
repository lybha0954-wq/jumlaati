/**
 * Pre-build script: removes duplicate Next.js page files that cause
 * "two parallel pages that resolve to the same path" build errors.
 *
 * The file src/app/(auth)/login/page.tsx conflicts with src/app/login/page.tsx
 * because route groups (auth) are URL-transparent in Next.js App Router.
 * Both resolve to /login, causing error #28 during filesystem route scanning.
 *
 * This script runs before `next dev` and `next build` to remove the duplicate.
 */

const fs = require('fs');
const path = require('path');

const duplicates = [
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/login/_page.tsx',
];

duplicates?.forEach((filePath) => {
  const fullPath = path?.resolve(process.cwd(), filePath);
  if (fs?.existsSync(fullPath)) {
    fs?.unlinkSync(fullPath);
    console.log(`[prune-duplicate-pages] Removed duplicate page: ${filePath}`);
  }
});
