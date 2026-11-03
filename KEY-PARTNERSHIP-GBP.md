# Key Partnership Recruitment: Google profile, search and AI search plan

Matt Stimpson, Key Partnership Recruitment Ltd (12733360). Tech, data and commercial recruitment, office in Stony Stratford, Milton Keynes. Written 3 Nov 2026, following `GAMBIA - WEBSITE /LOCAL-SEO-BOOST-PLAYBOOK.md` (the AP Creative Co job).

Goal: when someone searches "tech recruiter Milton Keynes", "IT recruitment agency Milton Keynes" or asks ChatGPT, Gemini or Google's AI "who's a good tech recruiter near Milton Keynes", Key Partnership comes up.

Keep these **identical** everywhere (site, Google, Bing, Apple, LinkedIn, directories):

- Name: `Key Partnership Recruitment`
- Phone: `01327 493143` (`+44 1327 493143`)
- Address: `Office 15, 76 High Street, Stony Stratford, Milton Keynes MK11 1AH`
- Website: `https://ourkeypartnership.co.uk/`
- Email: `info@ourkeypartnership.co.uk`

---

## Where it stands (3 Nov 2026)

**Google profile already exists and is verified** (Maps listing `0xedd1a0c46b2d63d9`, g/11qm0fjp9n):
- 5.0 from 47 reviews. Google's review tags: interview preparation (24), quality candidates (10), tech roles (4), tech recruiter (2).
- Category: Recruiter only.
- Address, phone, website and hours (closes 6pm) are set.
- **Only 3 photos.** No products or posts visible publicly. Description, services and service area not visible without manager access.

**Website:** the rebuilt site with full SEO (real HTML per page, titles, sitemap, robots, structured data, a page per job) is on branch `polish-nov-2026`, previewed at key-partnership-preview.vercel.app. **Not live yet.** The live site still returns a 404 status on every page, so Google can't index it properly until we push.

**Search Console file** `public/google4b6729940671f1e8.html` is added on the branch, ready to verify once live.

---

## Steps, in order

| # | Step | Who |
|---|---|---|
| 1 | Matt approves the preview; push `polish-nov-2026` to `main` | Jack says go, Claude pushes |
| 2 | Send a test application so Matt can activate the form service | Jack, then Matt clicks the email |
| 3 | Search Console: verify with the HTML file, submit `sitemap.xml`, request indexing of the home page | Claude, Jack signed in |
| 4 | Bing Webmaster Tools: import from Search Console | Claude, Jack signed in |
| 5 | Matt adds Jack as **Manager** on the profile (Business Profile > ⋮ > Business Profile settings > People and access > Add) | Matt |
| 6 | Profile edits below | Claude, after Jack says go |
| 7 | Photos from Matt (see list) and upload | Matt sends, Claude uploads in Chrome |
| 8 | Bing Places: import from the Google profile | Jack signs in, Claude imports |
| 9 | Review link to Matt, and a weekly post | Claude drafts, Matt sends |

---

## Profile edits, ready to paste

**Categories.** Keep **Recruiter** as primary. Add (check each exists in the UK list as you type): Employment agency, Executive search firm, Employment consultant. Nothing else fits honestly.

**Service area.** Keep the office address showing. Add: Milton Keynes, Northampton, Bedford, Buckingham, Oxford, and United Kingdom. *CONFIRM with Matt which towns his clients and candidates really are in.*

**Website field:** `https://ourkeypartnership.co.uk/`

**Description** (697 of 750 characters, no phone or links). Built only from his site's own copy. **Matt approves before it goes on**, as it replaces whatever he wrote:

> Key Partnership Recruitment is a tech recruitment agency in Stony Stratford, Milton Keynes, founded by Matt Stimpson. We recruit for technology businesses across Technology, Data & AI and Commercial roles, from graduate level through to CTO, in the UK and internationally, including the UAE, Australia and New Zealand. We work with a select group of clients on contingent, retained and fixed-fee terms. Most of our time is spent headhunting: identifying and engaging the right people, not just the available ones. Clients can expect three candidates per role and CVs within seven days. Candidates get regular contact and interview preparation, with consistent, honest communication at every stage.

**Services** (custom, each description from the site):

| Service | Description (max 300) |
|---|---|
| Technology recruitment | Hiring across the full tech stack, from graduate level through to CTO: software engineering, DevOps and cloud, platform and infrastructure. Based in Stony Stratford, Milton Keynes. |
| Software development recruitment | Full-stack recruitment from graduate to architect, across every major technology: back end, front end, full stack, architects, testers and product managers. |
| IT support and infrastructure recruitment | IT support, infrastructure, MSPs and technology rollouts, from SMEs to Fortune 500. |
| Data and AI recruitment | From data foundations to advanced AI: data engineering, BI and analytics, AI and machine learning specialists who turn data into decisions. |
| BI and data recruitment | BI developers, DBAs, data architects and visualisation specialists. |
| Commercial recruitment for tech businesses | Account management, business development and sales, customer success, and bid and tender management within technology businesses. |
| Retained and fixed-fee recruitment | For clients hiring regularly or building teams: a more cost-effective and consistent approach to hiring. |
| Contingent recruitment | No placement, no fee. We work on roles as they arise, with full commitment to quality on every search. |

**Products** (one tile each, "Services" category, link to the page):
- Technology recruitment → `/hire`
- Data & AI recruitment → `/hire`
- Commercial recruitment → `/hire`
- Live tech jobs → `/jobs`

Images: Matt's own photos only (below). No stock.

**Hours:** currently closes 6pm. *CONFIRM Matt's real days and hours.*

**Review link:** copy from Ask for reviews, check it with `curl -sIL` (must redirect to `writereview?placeid=`), then put it in the message below.

---

## Photos to get from Matt

Real only, no stock or AI. Resize to 1600px max, JPEG, name `key-partnership-NN-subject.jpg`.

1. Matt at his desk in the Stony Stratford office (cover photo).
2. The office building or door at 76 High Street (helps people find it).
3. Inside the office.
4. Matt on a call or meeting a client or candidate (with their OK).
5. Any event, award or team photo he has.
6. Logo: the real head-profile mark on a plain background, square.

Never delete his existing 3 photos without his say-so.

---

## Message for Jack to send Matt

> Alright Matt, for the Google profile I need a few bits off you:
>
> 1. Add me as a manager on the profile: Business Profile > the three dots > Business Profile settings > People and access > Add > my email > Manager.
> 2. Your real opening days and hours.
> 3. Which towns your clients and candidates are mostly in (I've put Milton Keynes, Northampton, Bedford, Buckingham, Oxford and UK-wide).
> 4. 4 to 6 photos: you at your desk, the office front, inside the office, you with a client or candidate if they're happy.
> 5. Have a read of the new profile description below and tell me if it's right.
>
> Once the new site is live I'll get it into Google Search Console and Bing so the job pages start showing in Google, then sort the profile, and give you a review link to send to clients and candidates you've placed recently.

---

## CONFIRM list for Matt

1. The new description.
2. Real hours.
3. Service-area towns.
4. Categories: Employment agency, Executive search firm, Employment consultant.
5. The favicon on the new site is a "KP" monogram, not his head-profile mark. Google shows the favicon beside the name in results. Send the logo file if he wants the real mark.

## Monthly check

- Search Console: clicks and impressions for "tech recruiter Milton Keynes", "IT recruitment Milton Keynes", and job titles.
- Google profile: calls, website clicks, direction requests, newest review date.
- Ask ChatGPT, Gemini, Google AI Mode and Perplexity, logged out, 3 times each: "who's a good tech recruiter near Milton Keynes", "IT recruitment agency Milton Keynes", "data recruitment agency Buckinghamshire". Note "named in X of Y".
- One real photo and one post a week (a new role, a placement with permission, an event).
