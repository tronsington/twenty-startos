import { sdk } from '../sdk'
import { setServerUrl } from './setServerUrl'

export const actions = sdk.Actions.of().addAction(setServerUrl)
