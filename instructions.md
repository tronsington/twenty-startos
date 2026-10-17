# Twenty on StartOS

Twenty is an open-source CRM: people, companies, deals, pipelines, email and
calendar sync, and workflow automation — served from your own box.

## First start

1. Install and open the service. Answer the **Set App Address** task before
   first start; pick the address you intend to keep.
2. Start the service. The first boot creates the database schema and takes a
   couple of minutes; health checks go green when it's actually serving.
3. Open the app, create your account and your first workspace. Email/calendar
   connectors (Google/Microsoft) and SMTP are not wired in this package
   version — those parts of Settings stay off.

## Notes

- Uploads and files live in the package's `storage` volume; the database
  backs up as a logical dump, so restores survive Postgres upgrades.
- The server and worker always come from the same image build; they upgrade
  together with the package.
