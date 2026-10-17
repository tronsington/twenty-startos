# twenty-startos

A [StartOS](https://start9.com) service package for
[Twenty](https://twenty.com) (`twentycrm/twenty`) — the open-source CRM.

```bash
git clone https://github.com/tronsington/twenty-startos
cd twenty-startos
npm ci
make x86        # twenty_x86_64.s9pk
make arm        # twenty_aarch64.s9pk (upstream publishes both)
```

## What this package is

|              |                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Upstream pin | `twentycrm/twenty@sha256:0afdba14…` = **v2.9.0** (amd64+arm64, digest-pinned)                                       |
| Sidecars     | `postgres:16@sha256:ca0bd484…`, `redis:7-alpine@sha256:858f009f…`                                                   |
| Interface    | one web UI + API on port 3000                                                                                       |
| Secrets      | `APP_SECRET` / `ENCRYPTION_KEY` / `FALLBACK_ENCRYPTION_KEY` / `PG password` — generated at install, never re-rolled |
| Daemons      | postgres + redis + server (+migrations at boot) + worker (`yarn worker:prod`)                                       |

v1 notes: email/calendar connectors and SMTP are not wired (envs stay unset);
storage is `STORAGE_TYPE=local` on the `storage` volume.

## Repo layout

- `startos/manifest/index.ts` — pins + volumes + RAM floor
- `startos/main.ts` — four daemons over the shared netns
- `startos/actions/setServerUrl.ts` — the `SERVER_URL` chooser (critical at install)
- `startos/backups.ts` — pg_dump + raw volumes
- `UPDATING.md` — pin-bump procedure
