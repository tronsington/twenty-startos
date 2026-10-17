export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Twenty': 0,
  'PostgreSQL is ready': 1,
  'Waiting for PostgreSQL to be ready': 2,
  'Redis is ready': 3,
  'Waiting for Redis to be ready': 4,
  Twenty: 5,
  'Twenty is ready': 6,
  'Twenty is not ready': 7,
  'Worker is running': 8,
  'Worker is not running': 9,
  // interfaces.ts
  'Twenty CRM web app and API': 10,
  // actions/setServerUrl.ts
  'Set App Address': 11,
  'Choose the address Twenty serves on.': 12,
  'App Address/URL': 13,
  'The address your browser will use to reach Twenty. Links Twenty generates (emails, calendar invites) point here; changing it later invalidates them.': 14,
  'No domain is switched on for the Twenty interface yet. Add one under Interfaces and switch it on there first.': 15,
  'Twenty builds absolute links (invites, email actions) from this address. Changing it later invalidates links it already generated. Choose the address you intend to keep.': 16,
  // init/seedFiles.ts
  'Choose the address Twenty serves its app on': 17,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
