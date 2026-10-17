import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'twenty',
  title: 'Twenty',
  license: 'AGPL-3.0', // matches upstream twentyhq/twenty
  packageRepo: 'https://github.com/tronsington/twenty-startos',
  upstreamRepo: 'https://github.com/twentyhq/twenty',
  marketingUrl: 'https://twenty.com',
  donationUrl: null,
  description: { short, long },
  // pgdata = Postgres cluster; storage = Twenty's .local-storage (uploads,
  // files); main = this package's own store.json. Do not co-locate.
  volumes: ['pgdata', 'storage', 'main'],
  images: {
    // twenty v2.48.0 on Docker Hub, pinned by digest; verified amd64+arm64
    // (index digest, resolved 2026-10-17; equals the current `latest`).
    // NOTE the tag-shape trap: bare `v2.9.0` is the newest *bare* tag but is
    // four months stale — upstream versions now ship as prefixed tags
    // (`twenty/v2.48.0`). Check recency, not just version shape.
    twenty: {
      source: {
        dockerTag:
          'twentycrm/twenty@sha256:43fab4bffacdcd63ff3c9257b7f8985a4424d81e9eb43982b9c16a841d555e52',
      },
      arch: ['x86_64', 'aarch64'],
    },
    // postgres:16 matches upstream's own compose (docker-compose.yml in
    // packages/twenty-docker); digest is Hub's current :16 index.
    postgres: {
      source: {
        dockerTag:
          'postgres:16@sha256:ca0bd484cb98bf4b24eb1010e73fb3fcbd6714d240fbc1a10eea5b7dbecb641d',
      },
      arch: ['x86_64', 'aarch64'],
    },
    // redis:7-alpine (relay package uses the same image family); pinned by
    // Hub index digest, resolved 2026-10-17.
    redis: {
      source: {
        dockerTag:
          'redis:7-alpine@sha256:858f009f9709ce576febc734aa78b8f6d624b82571f9ddb6bda4377c833b3499',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Server + worker + pg + redis. Twenty's own docs self-host floor is small;
  // 2 GiB minimum mirrors the relay package's precedent.
  hardwareRequirements: {
    ram: 2 * 1024 ** 3,
  },
})
