# New Astro Site Setup Checklist

## 1. Create the repo

- [ ] Copy from existing site: `cp -r bowngroup_website new_site`
- [ ] Remove old origin: `git remote remove origin`
- [ ] Create new repo on GitHub
- [ ] Add new origin: `git remote add origin https://github.com/bownie/new_repo.git`
- [ ] Push: `git push -u origin main`

## 2. Update site config

- [ ] Edit `src/config.ts` — site title, author, bio, social links
- [ ] Edit `astro.config.ts` — update `site` to new domain e.g. `https://newdomain.com`
- [ ] Remove sample blog posts from `src/content/blog/`
- [ ] Update `README.md` if present

## 3. GitHub Pages config

- [ ] Go to repo → Settings → Pages
- [ ] Set source to **GitHub Actions**
- [ ] Add custom domain e.g. `newdomain.com`
- [ ] Wait for DNS check to go green
- [ ] Confirm **Enforce HTTPS** is ticked

## 4. Cloudflare DNS

- [ ] Add four A records (name: `@`, DNS only — grey cloud):
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- [ ] Add CNAME record (name: `www`, target: `yourusername.github.io`, DNS only — grey cloud)
- [ ] Confirm proxied is **off** (grey cloud) for all five records

## 5. Dependencies (avoid build failures)

- [ ] Pin `@tailwindcss/vite` to `4.1.4` in `package.json`
- [ ] Set Node.js version to `22` in `.github/workflows/deploy.yml`
- [ ] Commit both `package.json` and `package-lock.json`

## 6. Verify

- [ ] Push a commit and check Actions tab — build should pass
- [ ] Visit the domain in a private window once DNS propagates
- [ ] Check HTTPS is working