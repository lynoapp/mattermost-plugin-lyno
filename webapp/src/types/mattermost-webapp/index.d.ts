import { Reducer } from 'redux';

export interface PluginRegistry {
  /**
    * Register a custom React component to manage the plugin configuration for the given setting key.
    * Accepts the following:
    * @param {string} key A key specified in the settings_schema.settings block of the plugin's manifest.
    * @param {React.ElementType} component A react component to render in place of the default handling.
    * @param {object} options Object for the following available options to display the setting:
    *     showTitle - Optional boolean that if true the display_name of the setting will be rendered
    * on the left column of the settings page and the registered component will be displayed on the
    * available space in the right column.
  */
  registerAdminConsoleCustomSetting(key: string, component: React.ElementType, options?: { showTitle: boolean }): void;

  /**
    * Register a component fixed to the top of the left-hand channel sidebar.
    * Accepts a React component. Returns a unique identifier.
  */
  registerLeftSidebarHeaderComponent(component: React.ElementType): void;

  /**
    * Register a reducer against the Redux store. It will be accessible in redux state
    * under "state['plugins-<yourpluginid>']"
    * Accepts a reducer. Returns undefined.
  */
  registerReducer(reducer: Reducer<any, any>): void;

  // Add more if needed from https://developers.mattermost.com/extend/plugins/webapp/reference
}
