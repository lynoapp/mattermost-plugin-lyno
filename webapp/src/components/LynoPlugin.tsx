import React from 'react';

import { ImageContext } from '@lyno/components';
import { GraphQLProvider } from '@lyno/client-helpers';

import { ChannelList } from './ChannelList';
import { JitsiControlBar } from './JitsiControlBar';
import { LynoPluginAuth } from './LynoPluginAuth';
import './LynoPlugin.scss';

export const LynoPlugin: React.FC = () => (
  <div className="lyno">
    <div className="lyno-plugin">
      <ImageContext.Provider value={{ basePath: '/' }}>
        <GraphQLProvider domain={process.env.LYNO_DOMAIN}>
          <LynoPluginAuth>
            <div>
              <div className="lyno-plugin__headline">Lyno Voice Rooms</div>
              <ChannelList />
              <JitsiControlBar />
            </div>
          </LynoPluginAuth>
        </GraphQLProvider>
      </ImageContext.Provider>
    </div>
  </div>
);
