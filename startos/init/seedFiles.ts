import { utils } from '@start9labs/start-sdk'
import { setServerUrl } from '../actions/setServerUrl'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    pgPassword: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 }),
    appSecret: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 40 }),
    encryptionKey: utils.getDefaultString({ charset: '0-9,a-f', len: 64 }),
    fallbackEncryptionKey: utils.getDefaultString({ charset: '0-9,a-f', len: 64 }),
  })

  await sdk.action.createOwnTask(effects, setServerUrl, 'critical', {
    reason: i18n('Choose the address Twenty serves its app on'),
  })
})
