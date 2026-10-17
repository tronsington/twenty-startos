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
- **The `chown-storage` oneshot (uid 1000) is load-bearing** — the image runs
  as uid 1000 and the StartOS volume mount shadows the image's baked-in
  ownership of `.local-storage`. Without it the server boots green and then
  dies on its first storage write (workspace creation / uploads) with
  EACCES — this exact failure shipped in 2.48.0:0 and was fixed in 2.48.0:1,
  verified live on Dylan's box. Never remove or weaken it.
- store.json lives on `main`, never mounted into daemons.
- Backups = pg_dump(pgdata) + raw `storage` + raw `main`. Rotating
  ENCRYPTION_KEY or APP_SECRET on restore is user data loss — never re-roll.

## Verified on real install (2026-10-17, Dylan's box, 2.48.0:0→:1)

- Worker's `pgrep -f twenty-server` health probe matches the real cmdline —
  worker logged crons ticking in live dumps.
- /healthz probe across a cold first boot with migrations (grace: 120 s) —
  migrations ran ~95 s, healthz green after, no flapping.
