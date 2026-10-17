import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  // Internal secrets, auto-generated at install (init/seedFiles.ts). Never
  // re-rolled: ENCRYPTION_KEY protects stored credentials; APP_SECRET signs
  // sessions. Rotation loses both.
  pgPassword: z.string().catch(''),
  appSecret: z.string().catch(''),
  encryptionKey: z.string().catch(''),
  fallbackEncryptionKey: z.string().catch(''),
  // Public URL of the app (SERVER_URL upstream), chosen via Set App Address.
  // Twenty builds absolute links and callback URLs from it; changing it later
  // breaks links in emails/sessions.
  serverUrl: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
