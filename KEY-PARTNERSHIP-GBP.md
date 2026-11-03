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

**Google profile already exists and is verified.** Jack is manager (business.google.com, profile id `17920806411130684495`, editor at `https://www.google.com/local/business/17920806411130684495/editprofile/info`). Read 3 Nov 2026:
- 5.0 from 47 reviews. Google's review tags: interview preparation (24), quality candidates (10), tech roles (4), tech recruiter (2).
- Category: Recruiter only.
- Description: Matt's own ("We know great talent when we see it... We are network-driven, relationship-focused recruiters operating mostly within the Technology Sector..."). It never says Milton Keynes or Stony Stratford.
- Hours: Mon to Thu 08:30 to 18:00, Fri 08:30 to 17:00, weekends closed. Already right, no need to ask Matt.
- Phone, website, address and LinkedIn set. No opening date, no service area, no chat.
- Services (12): Business Intelligence & Data, Data Visualisation, Fixed Term Contract, Front End Development, Onsite Support, Partnership Recruitment, Practice Interviews, Software Recruitment, Technology Support, Talent Management, IT Specialist Recruitment, Recruitment Process Outsourcing. None has a description. Nothing for Data & AI or Commercial.
- Products: none. Posts: none ever. Photos: 3.

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
| 5 | Matt adds Jack as **Manager** on the profile | Done 3 Nov |
| 6 | Profile edits below | Claude, after Jack says go |
| 7 | Photos from Matt (see list) and upload | Matt sends, Claude uploads in Chrome |
| 8 | Bing Places: import from the Google profile | Jack signs in, Claude imports |
| 9 | Review link to Matt, and a weekly post | Claude drafts, Matt sends |

---

## Profile edits, ready to paste

**Categories.** Keep **Recruiter** as primary. Add (check each exists in the UK list as you type): Employment agency, Executive search firm, Employment consultant. Nothing else fits honestly.

**Service area.** Keep the office address showing. Add: Milton Keynes, Northampton, Bedford, Buckingham, Oxford, and United Kingdom. *CONFIRM with Matt which towns his clients and candidates really are in.*

**Website field:** `https://ourkeypartnership.co.uk/`

**Description.** Keep Matt's text (playbook rule: it's the owner's). Only add the town, in his third paragraph:

> We are network-driven, relationship-focused recruiters **based in Stony Stratford, Milton Keynes,** operating mostly within the Technology Sector.

Full rewrite kept as a fallback if Matt wants one (697 characters, from site copy only):

> Key Partnership Recruitment is a tech recruitment agency in Stony Stratford, Milton Keynes, founded by Matt Stimpson. We recruit for technology businesses across Technology, Data & AI and Commercial roles, from graduate level through to CTO, in the UK and internationally, including the UAE, Australia and New Zealand. We work with a select group of clients on contingent, retained and fixed-fee terms. Most of our time is spent headhunting: identifying and engaging the right people, not just the available ones. Clients can expect three candidates per role and CVs within seven days. Candidates get regular contact and interview preparation, with consistent, honest communication at every stage.

**Opening date:** 10 July 2020 (incorporation date, shown in the site footer).

**Services.** Keep his 12. Add the ones missing (Technology recruitment, Data and AI recruitment, Commercial recruitment for tech businesses, Retained and fixed-fee recruitment, Contingent recruitment) and put descriptions on the main ones, all from the site:

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

**Hours:** already set by Matt (Mon to Thu 08:30 to 18:00, Fri to 17:00). Leave.

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
> 1. Thanks for the access, I'm in.
> 2. Which towns your clients and candidates are mostly in (I've put Milton Keynes, Northampton, Bedford, Buckingham, Oxford and UK-wide).
> 3. 4 to 6 photos: you at your desk, the office front, inside the office, you with a client or candidate if they're happy.
> 4. I'm keeping your description and just adding "based in Stony Stratford, Milton Keynes" so Google ties you to the area. Shout if you'd rather I didn't.
>
> Once the new site is live I'll get it into Google Search Console and Bing so the job pages start showing in Google, then sort the profile, and give you a review link to send to clients and candidates you've placed recently.

---

## CONFIRM list for Matt

1. Adding the town to his description.
2. Service-area towns.
3. Categories: Employment agency, Executive search firm, Employment consultant.
4. The favicon on the new site is a "KP" monogram, not his head-profile mark. Google shows the favicon beside the name in results. Send the logo file if he wants the real mark.

## Monthly check

- Search Console: clicks and impressions for "tech recruiter Milton Keynes", "IT recruitment Milton Keynes", and job titles.
- Google profile: calls, website clicks, direction requests, newest review date.
- Ask ChatGPT, Gemini, Google AI Mode and Perplexity, logged out, 3 times each: "who's a good tech recruiter near Milton Keynes", "IT recruitment agency Milton Keynes", "data recruitment agency Buckinghamshire". Note "named in X of Y".
- One real photo and one post a week (a new role, a placement with permission, an event).
