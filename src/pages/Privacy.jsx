import { EMAIL, LEGAL_NAME, COMPANY_NUMBER, REGISTERED_OFFICE, PHONE_DISPLAY } from '../lib/site'

// Draft for Matt to confirm (see HANDOVER.md). Kept to what the site does.
export function Privacy() {
  return (
    <>
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Privacy</p>
        <h1>Privacy notice</h1>
        <p>How Key Partnership Recruitment Ltd uses the details and CVs you send us. Last updated November 2026.</p>
      </div>
    </section>
    <section className="prose-section">
      <div className="container">
        <article className="prose-block">

          <h2>Who we are</h2>
          <p>
            {LEGAL_NAME} (company number <span className="tnum">{COMPANY_NUMBER}</span>, registered office {REGISTERED_OFFICE}) runs
            this website and decides how the personal information sent through it is used. Contact us about anything in this
            notice at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or on <span className="tnum">{PHONE_DISPLAY}</span>.
          </p>

          <h2>What we collect and why</h2>
          <h3>Job applications and CVs</h3>
          <p>Your name, email, phone number if you give it, your CV and anything you write. We use them to consider you for the role you applied for and for similar roles, and to introduce you to employers with your agreement. The lawful basis is our legitimate interest in providing a recruitment service you have asked for.</p>
          <h3>Vacancy enquiries</h3>
          <p>When you email us about a vacancy: your name, company, contact details and the role details. We use them to discuss and run the search. The lawful basis is taking steps at your request before entering into a contract.</p>
          <p>We do not use your details for marketing, and we do not sell them.</p>

          <h2>Who receives it</h2>
          <ul>
            <li>Our email provider stores the messages.</li>
            <li>GitHub hosts this website. Supabase stores the job adverts shown on it, so your browser connects to Supabase when a page loads; it does not hold your application.</li>
            <li>The background videos are served by Mixkit and the coverage map outline by jsDelivr, so your browser connects to them to load those files. Neither receives anything you type.</li>
            <li>An employer receives your CV only after we have discussed the role with you.</li>
          </ul>
          <p>Some of these providers are based in the United States. Where your information leaves the UK, it is protected by the UK Extension to the EU-US Data Privacy Framework or by standard contractual clauses.</p>

          <h2>How long we keep it</h2>
          <p>We keep CVs and applications for up to 2 years from our last contact with you, and vacancy enquiries for as long as we work together plus 6 years for accounting purposes. You can ask us to delete your details sooner.</p>

          <h2>Cookies</h2>
          <p>This website does not set cookies or use analytics. Maps load only when you select “Show map”, at which point Google Maps may set its own cookies.</p>

          <h2>Your rights</h2>
          <p>You can ask for a copy of your information, ask us to correct or delete it, object to how we use it, or ask us to restrict its use. Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will reply within one month.</p>

          <h2>Complaints</h2>
          <p>
            If you are unhappy with how we have handled your information, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with the
            subject “Data protection complaint”. We will acknowledge it within 30 days. You can also complain to the
            Information Commissioner’s Office at <a href="https://ico.org.uk/make-a-complaint/" rel="noopener">ico.org.uk/make-a-complaint</a> or on 0303 123 1113.
          </p>
        </article>
      </div>
    </section>
    </>
  )
}
