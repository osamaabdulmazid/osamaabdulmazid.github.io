# Osama Abdul Mazid — Portfolio Upgrade

## Files to upload to the GitHub Pages repository root
- index.html
- styles.css
- script.js
- robots.txt
- sitemap.xml
- .well-known/security.txt
- existing image assets and CV PDF from the current site

## Important
The old data-rendering `script.js` was not compatible with the supplied HTML because it expected element IDs that did not exist in that HTML. The new version is static-first and does not depend on the old data pipeline.

## Security model
This is a static GitHub Pages site:
- no database
- no server-side code
- no login
- no contact form backend
- no third-party JavaScript
- no `eval`, `innerHTML` rendering of user data, or dynamic HTML injection
- restrictive Content Security Policy
- `frame-ancestors 'none'`
- restrictive Permissions Policy
- `strict-origin-when-cross-origin` referrer policy
- external links use `noopener noreferrer`
- reduced-motion support
- accessible keyboard lightbox and navigation

GitHub Pages itself does not let a repository author set arbitrary HTTP security headers. The CSP and other policies included here are delivered via HTML meta tags; for stronger HTTP-header enforcement later, put the custom domain behind a platform/CDN that supports response headers.

## Existing assets expected by the page
profile.jpeg
Osama_Abdul_Mazid_CV.pdf
best-brand-representative.jpg
uopeople-ambassador-recognition-2.jpg
uci-human-resources-analytics.jpg
uopeople-strategy.jpg
uopeople-marketing.jpg
uopeople-finance.jpg
uopeople-accounting.jpg
interactive-cares-brand-representative.jpg
customer-service-excellence.jpg
public-speaking-workshop.jpg
customer-service-training.jpg
