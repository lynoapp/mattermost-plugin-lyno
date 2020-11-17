import { combineReducers } from 'redux';

import { authReducer } from '@lyno/client-helpers';
import { lynoSDKReducer } from '@lyno/client-sdk/src/reducers';
import { activeVoiceChannelReducer } from '@lyno/client-helpers/dist/reducers/activeVoiceChannel';

import manifest from './manifest';
import { LynoPlugin } from './components/LynoPlugin';

// eslint-disable-next-line import/no-unresolved
import { PluginRegistry } from './types/mattermost-webapp';

export default class Plugin {
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async initialize(registry: PluginRegistry): Promise<void> {
    registry.registerLeftSidebarHeaderComponent(LynoPlugin);

    registry.registerReducer(combineReducers({
      auth: authReducer,
      sdk: lynoSDKReducer,
      activeVoiceChannel: activeVoiceChannelReducer,
    }));

    /**
     * To signup the real authentity is needed
     * - the best would be an auth token from the server (maybe possible with GetSession in server plugin)
     * - server plugin sends token and domain to lyno server
     * - lyno server requests the user data from the mattermost server
     * - lyno server responds with a lyno auth token
     * - mattermost plugin sends lyno auth token to webapp plugin frontend
     */

    // Main problems:
    // session token expires and has to be automatically renewed
    // privacy policies not accepted by autosignup

    // TODO
    // Get shown user data directly from mattermost

    // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
  }
}

declare global {
  interface Window {
    registerPlugin(id: string, plugin: Plugin): void
  }
}

window.registerPlugin(manifest.id, new Plugin());
