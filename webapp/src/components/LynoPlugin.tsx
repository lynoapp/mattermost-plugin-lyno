import React, { useState } from 'react';
import { bemJoin } from 'bem-join';

import { ImageContext } from '@lyno/components';
import { GraphQLProvider } from '@lyno/client-helpers';

import { ChannelList } from './ChannelList';
import { JitsiControlBar } from './JitsiControlBar';
import { LynoPluginAuth } from './LynoPluginAuth';
import './LynoPlugin.scss';

const b = bemJoin('lyno-plugin');

export const LynoPlugin: React.FC = () => {
  const [lynoPrivacyAccepted, setLynoPrivacyAccepted] = useState(
    !!window.localStorage.getItem('lynoPrivacyAccepted'),
  );

  const acceptPrivacyPolicy = () => {
    setLynoPrivacyAccepted(true);
    window.localStorage.setItem('lynoPrivacyAccepted', 'true');
  }

  return (
    <div className="lyno">
      <div className={b()}>
        <ImageContext.Provider value={{ basePath: '/' }}>
          <GraphQLProvider domain={process.env.LYNO_DOMAIN}>
            <div>
              <div className={b('headline')}>Lyno Voice Rooms</div>
              {lynoPrivacyAccepted ? (
                <LynoPluginAuth>
                  <ChannelList />
                  <JitsiControlBar />
                </LynoPluginAuth>
              ) : (
                <>
                  <div className={b('privacy-hint')}>
                    Please read and accept<br/>
                    our <a href="https://lyno.io/privacy" target="_blank">privacy policy</a>.
                  </div>
                  <button className={b('privacy-button')} type="button" onClick={acceptPrivacyPolicy}>
                    Accept privacy policy
                  </button>
                </>
              )}
            </div>
          </GraphQLProvider>
        </ImageContext.Provider>
      </div>
    </div>
  );
};
