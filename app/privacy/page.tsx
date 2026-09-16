import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { loadSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  title: "Privacy Policy — New Creation Living",
  description:
    "How New Creation Living collects, uses, and protects information from housing applications, referrals, benefits screenings, and tour requests.",
  alternates: { canonical: "/privacy" },
};

export const revalidate = 30;

const CONTACT_EMAIL = "support@newcreationliving.org";
const CONTACT_PHONE = "(404) 731-2371";

export default async function PrivacyPage() {
  const content = await loadSiteContent();
  const tagline = content["brand.tagline"] || "From Benefits to Belonging";

  return (
    <LegalPage title="Privacy Policy" tagline={tagline} updated="September 16, 2026">
      <p>
        New Creation Living provides structured, all-inclusive housing for independent
        adults on fixed government income in Metro Atlanta and Middle Georgia. We also
        help people understand and apply for benefits they may qualify for. This policy
        explains what we collect when you use{" "}
        <a href="https://www.newcreationliving.org">newcreationliving.org</a>, why we
        collect it, and how we handle it.
      </p>
      <p>
        We are a structured independent living provider, not a licensed personal care
        home or a medical provider. We still treat housing, benefits, and health-related
        answers as sensitive and limit who on our team can see them.
      </p>

      <h2>Information we collect</h2>
      <p>You choose what to send us. Typical submissions include:</p>
      <ul>
        <li>
          <strong>Residency applications.</strong> Name, phone, email, date of birth,
          gender, benefit type and monthly amount, living situation, whether others
          would live with you, emergency contact, how you heard about us, and answers
          about mobility, mental health, medications, medical diagnoses, criminal
          history, and substance use. We use these answers to see whether independent,
          roommate-style housing is a fit.
        </li>
        <li>
          <strong>Referrals.</strong> The same kinds of details about the person being
          referred, plus the referrer’s name, role, organization, and contact
          information (for example a social worker, discharge planner, VA staff member,
          or family member).
        </li>
        <li>
          <strong>Benefits screening.</strong> Contact information, which benefit you
          are asking about (SSI, SSDI, VA, Social Security), prior applications, work
          and military history, disability, income, and assets. We use this to evaluate
          a path to approval and may share it with the attorneys who help on those
          cases.
        </li>
        <li>
          <strong>Tour requests and move-in scheduling.</strong> Name, phone, email,
          preferred visit date, and similar details needed to show a home or confirm a
          move-in.
        </li>
      </ul>
      <p>
        If you reach us through an advertisement (for example Facebook or Google), that
        platform may also send us the name, phone number, or other details you entered
        on the ad.
      </p>
      <p>
        The website also collects ordinary technical data: pages visited, approximate
        location from IP address, device and browser type, and whether a form was
        submitted. Advertising and analytics tools (Google Tag Manager, Google Ads, and
        Meta Pixel) help us know which ads and pages led someone to apply, refer, ask
        about benefits, or schedule a tour. Those companies may set cookies or similar
        identifiers on your device.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>Review applications and referrals and follow up by phone, email, or text</li>
        <li>Confirm benefit eligibility and run a standard background check</li>
        <li>Match someone to an available room and schedule tours or move-in</li>
        <li>Help with SSI, SSDI, VA, or Social Security screening and applications</li>
        <li>Operate the homes (house managers and owners who need the file)</li>
        <li>Measure and improve our website and advertising</li>
        <li>Keep records we are required or reasonably need to keep</li>
      </ul>
      <p>
        We do not sell your information. We do not use application answers to build
        public marketing lists.
      </p>

      <h2>Who can see it</h2>
      <p>We share information only as needed to place someone or help with benefits:</p>
      <ul>
        <li>New Creation Living staff, house managers, and owners</li>
        <li>
          Benefits attorneys and related professionals when you ask us for help applying
          for government benefits
        </li>
        <li>
          Service providers that host this website, store form submissions, and send
          email or text messages on our behalf
        </li>
        <li>
          Advertising platforms (Google and Meta) for page views and conversion
          measurement — not the full contents of your application
        </li>
        <li>A court, regulator, or other party if the law requires it</li>
      </ul>
      <p>
        Referrers should only send information they are allowed to share. If you refer
        someone else, you are responsible for having a basis to give us their details.
      </p>

      <h2>Sensitive answers</h2>
      <p>
        Housing and benefits forms ask about health, disability, medications, income,
        criminal history, and substance use because those facts affect whether
        independent roommate-style housing is appropriate and whether someone may
        qualify for benefits. A government benefit often already reflects a
        work-limiting condition. We keep those answers in the application file for
        screening and operations. They are not used as a public marketing score.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep inquiries, applications, referrals, and resident-related records for as
        long as we need them to follow up, operate housing, handle a later return, or
        meet recordkeeping and legal duties. You can ask us to correct or delete
        information we no longer need to keep.
      </p>

      <h2>Your choices</h2>
      <p>
        You can apply, refer, or request a tour without creating an account. You can
        decline optional fields. You can ask us for a copy of what we have, to correct
        it, or to delete it where we are not required to retain it. Browser settings
        can block some cookies; blocking advertising cookies may not stop the site from
        working, but it can make our ads less accurate.
      </p>
      <p>
        This site is for adults seeking housing or helping an adult do so. It is not
        directed at children under 18.
      </p>

      <h2>How to reach us</h2>
      <p>
        Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call{" "}
        <a href="tel:+14047312371">{CONTACT_PHONE}</a>. Put “Privacy request” in the
        subject line if you are asking about your information.
      </p>
      <p>
        We may update this policy when our practices change. The date at the top is the
        current version. For housing programs and locations, return to the{" "}
        <Link href="/">main site</Link>.
      </p>
    </LegalPage>
  );
}
