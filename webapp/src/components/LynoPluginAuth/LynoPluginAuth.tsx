import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from 'mattermost-redux/selectors/entities/general';
import { GlobalState } from 'mattermost-redux/types/store';
import { ClientConfig } from 'mattermost-redux/types/config';

import {
  getLynoStore,
  LynoAuthRootState,
  setActiveUser,
  setAuthToken,
} from '@lyno/client-helpers';

import manifest from '../../manifest';
import { AuthType, useLynoPluginAuthMutationMutation } from '../../generated/types';

const getPluginServerRoute = (siteUrl: ClientConfig['SiteURL']) => {
  let basePath = '';
  if (siteUrl) {
    basePath = new URL(siteUrl).pathname;

    if (basePath && basePath[basePath.length - 1] === '/') {
      basePath = basePath.substr(0, basePath.length - 1);
    }
  }

  return `${basePath}/plugins/${manifest.id}`;
};

export const LynoPluginAuth: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const teamId = useSelector((state: GlobalState) => state.entities.teams.currentTeamId);
  const config = useSelector(getConfig);
  const tokenData = useSelector((state: LynoAuthRootState) => getLynoStore<LynoAuthRootState>(state).auth.tokenData);
  const pluginServerRoute = getPluginServerRoute(config?.SiteURL);
  const [mutate, result] = useLynoPluginAuthMutationMutation();
  const [auth, setAuth] = useState<{
    teamId: string;
    token: string;
  }>();

  useEffect(() => {
    const getToken = async () => {
      const { sessionToken } = await (await fetch(pluginServerRoute)).json();
      const { data } = await mutate({
        variables: {
          type: AuthType.Mattermost,
          code: sessionToken,
          siteUrl: config.SiteURL,
          teamId,
        },
      });
      if (!data || result.error) {
        // eslint-disable-next-line no-console
        console.error('io.lyno.plugin', 'Requesting auth token from lyno servers failed.', result.error);
        return;
      }
      setAuth({ teamId, token: data.authenticate.token });
      dispatch(setActiveUser(data.authenticate.id));
      dispatch(setAuthToken(data.authenticate.token));
    };

    if (teamId) {
      getToken();
    }
  }, [teamId]);

  // TODO: refresh token if expired and show loader

  if (!auth || !tokenData) return null;
  const currentTime = Date.now() / 1000;
  const isExpired = currentTime >= tokenData.exp;
  if (isExpired || auth.teamId !== teamId) return null;

  return <>{children}</>;
};
