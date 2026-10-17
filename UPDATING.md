# Updating the upstream version

Upstream (`twentyhq/twenty`) releases as `vX.Y.Z` image tags on Docker Hub
(`twentycrm/twenty`). This package pins by **digest**.

A bump is:

1. Pick the upstream release (https://github.com/twentyhq/twenty/releases).
2. Resolve the digest: `docker buildx imagetools inspect twentycrm/twenty:vX.Y.Z`
   — top-level `Digest:`, confirm amd64+arm64 children are both present.
3. Re-read `packages/twenty-docker/docker-compose.yml` at that tag for new or
   renamed env vars before touching `startos/main.ts`.
4. Update `dockerTag` in `startos/manifest/index.ts`, the pin table in
   `README.md`, and `version` in `startos/versions/current.ts` (`X.Y.Z:0`).
5. Release notes: 5 locales.
6. Build + install on the test box. First boot after a real upgrade runs the
   server's built-in migrations — watch health before declaring done.
