# Key Partnership Recruitment: polish handover

3 November 2026. Live site: https://ourkeypartnership.co.uk. Preview: https://key-partnership-preview.vercel.app (every page sends `noindex`).

Matt and Dan preferred the original design, so this branch (`polish-nov-2026`) keeps it, stock videos included, and adds the upgrades below. The ledger-style redesign Jack showed first is kept on branch `redesign-nov-2026` and is not used. Both branches are local only, **nothing pushed**. Pushing `polish-nov-2026` to `main` makes it live (the GitHub Action builds into `docs/`).

## What changed

**SEO and AI search (on-site only, no Google accounts touched)**
- Every page is now real HTML at build time. Before, every URL returned HTTP 404 and an empty page to search engines.
- Unique titles, descriptions and canonicals per page, plus a share image and a full icon set.
- `robots.txt` and `sitemap.xml`.
- Structured data: EmploymentAgency, WebSite, BreadcrumbList, and JobPosting on every role, so roles can appear in Google's job search.
- The Action now also runs hourly, so roles added in `/admin` get their own page. New roles still open in the browser between builds.

**Job page**
- Adverts pasted from Word are cleaned up: no stray fonts, typed bullets become real lists, shouty headings become sentence case.
- An on-page apply form with CV upload replaces the mailto link. It shows errors next to fields and a summary at the top, and leads to a confirmation page.
- Hero buttons: apply and share. Matt's photo and phone in the sidebar card, plus a reference number.
- Related roles, a proper "role filled" page, and a sticky Apply / Call bar on phones.

**Small details**
- Loading skeletons for roles and the job page.
- Videos fade in instead of flashing in.
- Carousel arrows disable at the ends.
- Buttons press in when tapped.
- Visible keyboard focus, a skip link, a mobile menu that closes with Esc and returns focus, and links in the hidden menu can no longer be tabbed to.
- The typing headline reads as "Relationships" to screen readers and search engines.
- Reduced-motion users get native scrolling and still videos.
- Maps load only on "Show map" (Google Maps sets cookies).
- Tidier type: balanced headings, tabular figures on salaries.

**Fixes**
- Dead footer links (Contact, Privacy Policy) and the "Find your next role" link now go to real pages.
- New privacy notice (draft) and a real 404 page.
- Em dashes removed from site copy; phone number formatted 01327 493143.
- Registered office and company details added to the footer.
- Unused pages and leftover files removed.

**Spruce-up after Matt's feedback (nudged towards burnssheehan.co.uk)**
- Hero spotlight: on desktop, a soft light follows the mouse across the dark heroes and brightens the video under it. Off on touch screens and for reduced motion.
- Home hero now has two buttons: "Submit a vacancy" and "View live roles".
- Hero stats are big clean numbers on a thin line, replacing the blurred glass tiles. They count up from zero when the page opens (the £30,000+ on the hire page does too).
- The same clean, ruled look carried down the site: "What we're known for" and "What you can expect" are open columns (no icon boxes or 01/02/03), the specialism and review cards lose the frosted glass, and the mouse spotlight also lights the two big video bands lower on the home page.

**No stock videos (3 November 2026)**
- Every Mixkit video and Unsplash photo is gone. The home, jobs and hire heroes use the Headhunt design: the skills Matt recruits for and his live role titles set as faint type, found by a spotlight that follows the mouse (or drifts on its own on phones). Live role titles come from Supabase, so they change as roles are added.
- The other sections that had video are solid brand green, each with one quiet touch: a faint line of words behind "Recruitment done the right way" that the spotlight picks out, a soft light that follows the mouse on the closing green sections, and live local times for Milton Keynes, Dubai, Sydney and Auckland on the hire page.
- Three other hero designs (a role card stack, a duotone Matt portrait, a UK map of live roles) were tried and left out. They are in the git history at commit b7553fd if wanted later.

## Before going live

1. Matt checks the preview and the CONFIRM list below.
2. Push `polish-nov-2026` to `main`. Check the Action passes (it uses the existing Supabase secrets).
3. **Straight after it is live:** send one test application from a job page. FormSubmit emails an activation link to info@ourkeypartnership.co.uk, and Matt must click it. Until then, applications are not delivered. Send a second test and check it arrives with the CV attached and not in spam.
4. When Jack wants: Search Console and Bing (submit `sitemap.xml`), Google Business Profile.

## CONFIRM list for Matt

1. Privacy notice draft: CV retention (written as up to 2 years), his email provider, lawful bases.
2. Response time on the apply form and confirmation page: "within 24 hours" (taken from the old job page).
3. Job adverts don't say permanent or contract (the law asks agencies to). Adding an "Employment type" field to the admin needs a new Supabase column.
4. Google job markup names Key Partnership as the hiring organisation for confidential clients.
5. The stats (95%, 90%, 80%, 500+) and the £30,000 saving are unchanged from his site. Keep a note of where they come from.

## Security (not fixed)

The admin password is written in `src/pages/Admin.jsx`, which is public on GitHub and in the site's JavaScript. Admin edits use the public Supabase key, so the jobs table is only as safe as its row-level security rules. Check those, and move the admin to Supabase Auth.
