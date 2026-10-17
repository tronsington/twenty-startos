import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.9.0:0',
  releaseNotes: {
    en_US:
      'Initial StartOS package of Twenty CRM v2.9.0 (twentycrm/twenty, digest-pinned). Runs the server, worker, internal Postgres and Redis; pick the app address at install before first start.',
    es_ES:
      'Paquete inicial para StartOS de Twenty CRM v2.9.0 (twentycrm/twenty, fijado por digest). Ejecuta el servidor, el worker, Postgres y Redis internos; elige la dirección de la app al instalar, antes del primer arranque.',
    de_DE:
      'Erstes StartOS-Paket für Twenty CRM v2.9.0 (twentycrm/twenty, per Digest angepinnt). Startet Server, Worker und internes Postgres und Redis; wähle die App-Adresse bei der Installation vor dem ersten Start.',
    pl_PL:
      'Pierwszy pakiet StartOS dla Twenty CRM v2.9.0 (twentycrm/twenty, przypięty po digeście). Uruchamia serwer, workera oraz wewnętrzne Postgres i Redis; wybierz adres aplikacji przy instalacji, przed pierwszym startem.',
    fr_FR:
      "Premier paquet StartOS pour Twenty CRM v2.9.0 (twentycrm/twenty, épinglé par digest). Lance le serveur, le worker ainsi que Postgres et Redis internes ; choisissez l'adresse de l'app à l'installation, avant le premier démarrage.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
