import { Reducer } from 'redux';

export interface PluginRegistry {
  registerLeftSidebarHeaderComponent(component: React.ElementType)
  registerReducer(reducer: Reducer<any, any>): void;

  // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
