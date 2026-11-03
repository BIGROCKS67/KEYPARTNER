import { EnquiryForm, Field, checks } from './Form'
import { SITE_URL, CV_MAX_MB } from '../lib/site'
import { jobPath, jobRef } from '../lib/jobs'

const CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function ApplyForm({ job }) {
  const ref = jobRef(job)
  return (
    <EnquiryForm
      subject={`Application: ${job.title} (${ref})`}
      next="/applied"
      submitLabel="Send my application"
      extra={{ Role: job.title, Reference: ref, 'Role page': `${SITE_URL}${jobPath(job)}` }}
      rules={{ name: checks.name, email: checks.email, phone: checks.phoneOptional, attachment: checks.file({ required: true }) }}
      notice="Matt receives your details and CV by email and uses them to put you forward for this role and similar ones. He keeps them for up to 2 years unless you ask him to delete them sooner."
    >
      {(e) => (
        <>
          <div className="enquiry__row">
            <Field name="name" label="Full name" autoComplete="name" error={e.name} />
            <Field name="email" label="Email address" type="email" autoComplete="email" inputMode="email" spellCheck="false" error={e.email} />
          </div>
          <Field name="phone" label="Phone number (optional)" type="tel" autoComplete="tel" inputMode="tel" error={e.phone} width="20rem" />
          <Field name="attachment" label="Your CV" hint={`PDF or Word document, up to ${CV_MAX_MB}MB`} type="file" accept={CV_ACCEPT} error={e.attachment} />
          <Field name="message" label="Anything we should know (optional)" hint="Notice period, salary expectations or questions about the role" as="textarea" rows={4} />
        </>
      )}
    </EnquiryForm>
  )
}
