import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import {
  POSTGRES_DB,
  POSTGRES_PATH,
  POSTGRES_USER,
  REDIS_PORT,
  SERVER_PORT,
  STORAGE_PATH,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Twenty'))

  // Mapped read: only fields that feed daemon env (relay package precedent).
  const store = await storeJson
    .read((s) => ({
      pgPassword: s.pgPassword,
      appSecret: s.appSecret,
      encryptionKey: s.encryptionKey,
      fallbackEncryptionKey: s.fallbackEncryptionKey,
      serverUrl: s.serverUrl,
    }))
    .const(effects)

  const pgPassword = store?.pgPassword ?? ''
  const appSecret = store?.appSecret ?? ''
  const encryptionKey = store?.encryptionKey ?? ''
  const fallbackEncryptionKey = store?.fallbackEncryptionKey ?? ''
  const serverUrl = store?.serverUrl ?? ''

  const pgUrl = `postgres://${POSTGRES_USER}:${pgPassword}@127.0.0.1:5432/${POSTGRES_DB}`
  const redisUrl = `redis://127.0.0.1:${REDIS_PORT}`

  /**
   * ======================== PostgreSQL sidecar ========================
   */
  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'pgdata',
      subpath: null,
      mountpoint: POSTGRES_PATH,
      readonly: false,
    }),
    'postgres',
  )

  /**
   * ======================== Redis sidecar ========================
   * noeviction policy per upstream's compose; loopback-only, no password —
   * this mirrors upstream's self-host defaults for a single-tenant LAN
   * service rather than the relay's password'd multi-tenant shape.
   */
  const redisSub = sdk.SubContainer.of(
    effects,
    { imageId: 'redis' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: 'redis',
      mountpoint: '/data',
      readonly: false,
    }),
    'redis',
  )

  const serverSub = sdk.SubContainer.of(
    effects,
    { imageId: 'twenty' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'storage',
      subpath: null,
      mountpoint: STORAGE_PATH,
      readonly: false,
    }),
    'twenty-server',
  )
  const workerSub = sdk.SubContainer.of(
    effects,
    { imageId: 'twenty' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'storage',
      subpath: null,
      mountpoint: STORAGE_PATH,
      readonly: false,
    }),
    'twenty-worker',
  )

  /**
   * ======================== chown-storage oneshot ========================
   */
  const chownSub = sdk.SubContainer.of(
    effects,
    { imageId: 'twenty' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'storage',
      subpath: null,
      mountpoint: STORAGE_PATH,
      readonly: false,
    }),
    'chown-storage',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('chown-storage', {
      // A fresh StartOS volume mounts root-owned and shadows the ownership
      // the twenty image bakes into .local-storage (the image runs as uid
      // 1000). Server and worker both write here (workspace seeding, user
      // uploads); without this oneshot the server boots green and then dies
      // on its first storage write with EACCES — seen live as a failing
      // workspace-creation step (v2.48.0:0 bug, fixed in 2.48.0:1). Same
      // shape as outline's chown-outline and monica's chown-storage.
      subcontainer: chownSub,
      exec: {
        command: ['chown', '-R', '1000:1000', STORAGE_PATH],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_DB,
          POSTGRES_USER,
          POSTGRES_PASSWORD: pgPassword,
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const result = await postgresSub.exec([
            'pg_isready',
            '-q',
            '-h',
            '127.0.0.1',
            '-U',
            POSTGRES_USER,
            '-d',
            POSTGRES_DB,
          ])
          return result.exitCode === 0
            ? { result: 'success', message: i18n('PostgreSQL is ready') }
            : {
                result: 'starting',
                message: i18n('Waiting for PostgreSQL to be ready'),
              }
        },
        gracePeriod: 30_000,
      },
      requires: [],
    })
    .addDaemon('redis', {
      subcontainer: redisSub,
      exec: {
        command: sdk.useEntrypoint(['--maxmemory-policy', 'noeviction']),
      },
      ready: {
        display: null,
        fn: async () => {
          const result = await redisSub.exec(['redis-cli', 'ping'])
          return result.exitCode === 0 &&
            result.stdout.toString().trim() === 'PONG'
            ? { result: 'success', message: i18n('Redis is ready') }
            : {
                result: 'starting',
                message: i18n('Waiting for Redis to be ready'),
              }
        },
        gracePeriod: 30_000,
      },
      requires: [],
    })
    .addDaemon('server', {
      subcontainer: serverSub,
      exec: {
        // Upstream entrypoint already runs the server and (unless disabled)
        // the DB migrations at boot — the upgrade gate.
        command: sdk.useEntrypoint(),
        env: {
          NODE_PORT: String(SERVER_PORT),
          PG_DATABASE_URL: pgUrl,
          SERVER_URL: serverUrl,
          REDIS_URL: redisUrl,
          STORAGE_TYPE: 'local',
          APP_SECRET: appSecret,
          ENCRYPTION_KEY: encryptionKey,
          FALLBACK_ENCRYPTION_KEY: fallbackEncryptionKey,
        },
      },
      ready: {
        display: i18n('Twenty'),
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://127.0.0.1:${SERVER_PORT}/healthz`,
            {
              successMessage: i18n('Twenty is ready'),
              errorMessage: i18n('Twenty is not ready'),
            },
          ),
        // First boot creates the schema before serving.
        gracePeriod: 120_000,
      },
      requires: ['postgres', 'redis', 'chown-storage'],
    })
    .addDaemon('worker', {
      subcontainer: workerSub,
      exec: {
        command: ['yarn', 'worker:prod'],
        env: {
          PG_DATABASE_URL: pgUrl,
          SERVER_URL: serverUrl,
          REDIS_URL: redisUrl,
          STORAGE_TYPE: 'local',
          APP_SECRET: appSecret,
          ENCRYPTION_KEY: encryptionKey,
          FALLBACK_ENCRYPTION_KEY: fallbackEncryptionKey,
          // Server already ran them; upstream compose disables both here.
          DISABLE_DB_MIGRATIONS: 'true',
          DISABLE_CRON_JOBS_REGISTRATION: 'true',
        },
      },
      ready: {
        display: null, // internal worker, no port of its own
        fn: async () => {
          const result = await workerSub.exec(['pgrep', '-f', 'twenty-server'])
          return result.exitCode === 0
            ? { result: 'success', message: i18n('Worker is running') }
            : { result: 'failure', message: i18n('Worker is not running') }
        },
        gracePeriod: 60_000,
      },
      requires: ['server', 'postgres', 'redis', 'chown-storage'],
    })
})
