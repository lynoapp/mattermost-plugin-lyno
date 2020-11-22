import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfig } from 'mattermost-redux/selectors/entities/general';
import { GlobalState } from 'mattermost-redux/types/store';
import { decode } from 'jsonwebtoken';

import { UserToken } from '@lyno/types';
import { ImageContext } from '@lyno/components';
import { GraphQLProvider, setActiveUser } from '@lyno/client-helpers';

import manifest from '../manifest';

import { ChannelList } from './ChannelList';
import { JitsiControlBar } from './JitsiControlBar';
import './LynoPlugin.scss';

const getPluginServerRoute = (state: GlobalState) => {
  const config = getConfig(state);

  let basePath = '';
  if (config && config.SiteURL) {
    basePath = new URL(config.SiteURL).pathname;

    if (basePath && basePath[basePath.length - 1] === '/') {
      basePath = basePath.substr(0, basePath.length - 1);
    }
  }

  return `${basePath}/plugins/${manifest.id}`;
};

export const LynoPlugin: React.FC = () => {
  const teamId = useSelector((state: GlobalState) => state.entities.teams.currentTeamId);
  const pluginServerRoute = useSelector((state: GlobalState) => getPluginServerRoute(state));
  const [auth, setAuth] = useState<{
    teamId: string;
    token: string;
  }>();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      const { token } = await (await fetch(`${pluginServerRoute}?teamId=${teamId}`)).json();
      setAuth({ teamId, token });

      const tokenData = decode(token) as UserToken;
      dispatch(setActiveUser(tokenData.users[0]));
    };

    if (teamId) {
      getToken();
    }
  }, [pluginServerRoute, teamId]);

  // TODO: refresh token if expired and show loader

  if (!auth) return null;
  const currentTime = Date.now() / 1000;
  const tokenData = decode(auth.token) as UserToken;
  const isExpired = currentTime >= tokenData.exp;
  if (isExpired || auth.teamId !== teamId) return null;

  return (
    <div className="lyno">
      <div className="lyno-plugin">
        <ImageContext.Provider value={{ basePath: pluginServerRoute }}>
          <GraphQLProvider domain={process.env.LYNO_DOMAIN} authToken={auth.token}>
            <div>
              <div className="lyno-plugin__headline">Lyno Voice Rooms</div>
              <ChannelList activeUser={tokenData.users[0]} teamId={teamId} />
              <JitsiControlBar />
            </div>
          </GraphQLProvider>
        </ImageContext.Provider>
      </div>
    </div>
  );
};
