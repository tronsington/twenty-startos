import { getTwentyServerUrls } from '../interfaces'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  url: Value.dynamicSelect(async ({ effects }) => {
    const urls = await getTwentyServerUrls(effects)
    return {
      name: i18n('App Address/URL'),
      description: urls.length
        ? i18n(
            'The address your browser will use to reach Twenty. Links Twenty generates (emails, calendar invites) point here; changing it later invalidates them.',
          )
        : i18n(
            'No domain is switched on for the Twenty interface yet. Add one under Interfaces and switch it on there first.',
          ),
      warning: null,
      values: urls.reduce(
        (obj: Record<string, string>, url: string) => ({ ...obj, [url]: url }),
        {},
      ),
      default: null,
    }
  }),
})

export const setServerUrl = sdk.Action.withInput(
  'set-server-url',
  async () => ({
    name: i18n('Set App Address'),
    description: i18n('Choose the address Twenty serves on.'),
    warning: i18n(
      'Twenty builds absolute links (invites, email actions) from this address. Changing it later invalidates links it already generated. Choose the address you intend to keep.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'hidden',
  }),
  inputSpec,
  async () => ({}),
  async ({ effects, input }) => {
    await storeJson.merge(effects, { serverUrl: input.url })
  },
)
