# AGENTS.md — twenty-startos

StartOS service-package repository for [Twenty](https://github.com/twentyhq/twenty)
(open-source CRM), wrapping the official `twentycrm/twenty` image
(digest-pinned; README has the pin table) with postgres + redis sidecars.
**Start every task at the SDK recipe index** — same discipline as siblings.

## Design decisions not to re-litigate

- **SERVER_URL comes only from the Set App Address action** (critical task at
  install). Twenty builds absolute links from it; do not "helpfully" default it.
- **Worker mirrors upstream's disables**: `DISABLE_DB_MIGRATIONS=true` +
  `DISABLE_CRON_JOBS_REGISTRATION=true` — the server owns both at boot.
- **Redis has no password**, matching upstream's single-tenant compose; it is
  loopback-only inside the package's netns. The relay package's password'd
  shape is a multi-tenant relay thing, not the default.
- **STORAGE_TYPE=local** on the `storage` volume, mounted into BOTH server and
  worker at upstream's exact path (`/app/packages/twenty-server/.local-storage`).
  Diverge and uploads break silently.
- store.json lives on `main`, never mounted into daemons.
- Backups = pg_dump(pgdata) + raw `storage` + raw `main`. Rotating
  ENCRYPTION_KEY or APP_SECRET on restore is user data loss — never re-roll.

## Known-untested (verify on first real install)

- Worker's `pgrep -f twenty-server` health probe matches the real cmdline.
- /healthz probe across a cold first boot with migrations (grace: 120 s).
