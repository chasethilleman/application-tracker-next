import Link from "next/link";

const LAST_UPDATED = "March 24, 2024";

export const metadata = {
  title: "Privacy Policy | Application Tracker",
  description:
    "Learn how Application Tracker collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-neutral-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Privacy
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-base leading-7 text-slate-700 dark:text-slate-200">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Overview
            </h2>
            <p className="mt-3">
              Application Tracker helps you stay organized while searching for
              new roles. This Privacy Policy explains what information we
              collect, how we use it, and the choices you have to control your
              data. By using Application Tracker, you consent to the practices
              described below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Information We Collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium">Account details:</span> When you
                sign in, we receive basic information like your name, email
                address, and profile image from your authentication provider.
              </li>
              <li>
                <span className="font-medium">Application data:</span> We store
                the roles, companies, statuses, notes, and other details you add
                so you can manage your job search in one place.
              </li>
              <li>
                <span className="font-medium">Usage data:</span> We may collect
                simple analytics about how you interact with the app to improve
                features and stability. This information is aggregated and does
                not identify you personally.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Deliver and maintain core Application Tracker features.</li>
              <li>
                Provide support, respond to questions, and troubleshoot issues.
              </li>
              <li>
                Monitor usage patterns so we can improve performance and inform
                future updates.
              </li>
              <li>
                Protect the security of the platform, including preventing
                unauthorized access.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              How We Share Information
            </h2>
            <p className="mt-3">
              We do not sell your data. We only share information when necessary
              to operate the service, comply with legal obligations, or protect
              rights and safety. Any third-party service providers we rely on
              are contractually obligated to handle your data securely and only
              for the purposes we specify.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Data Retention and Security
            </h2>
            <p className="mt-3">
              We retain your data for as long as you maintain an account or as
              needed to provide the service. We use reasonable technical and
              organizational safeguards to protect your personal information.
              Despite these efforts, no system is completely secure, and we
              encourage you to use strong passwords and keep your devices
              protected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your Choices
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Update or delete your application data directly within the app.
              </li>
              <li>
                Request account deletion by contacting us; we will remove your
                personal information, unless retention is required by law.
              </li>
              <li>
                Adjust notification preferences and third-party account settings
                with the authentication provider you use to sign in.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Children&rsquo;s Privacy
            </h2>
            <p className="mt-3">
              Application Tracker is not directed to individuals under the age
              of 16, and we do not knowingly collect personal information from
              children. If you believe a child has provided us with personal
              information, please contact us so we can take appropriate steps.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect
              product updates, legal requirements, or other changes. If we make
              significant changes, we will provide notice through the app or by
              other appropriate means. The revised policy will be effective when
              it is posted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Contact Us
            </h2>
            <p className="mt-3">
              Questions about this Privacy Policy or your data? Reach out at{" "}
              <a
                href="mailto:privacy@applicationtracker.app"
                className="font-medium text-blue-600 underline transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                privacy@applicationtracker.app
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <p>Application Tracker</p>
          <Link
            href="/"
            className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
