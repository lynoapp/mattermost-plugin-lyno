import React from 'react';
import { useSelector } from 'react-redux';
import { getLynoStore, LynoActiveVoiceChannelRootState, LynoAuthRootState } from '@lyno/client-helpers';

import { useJitsiControlBarQueryQuery } from '../../generated/types';

import { JitsiControlBarRenderer } from './JitsiControlBar';

export const JitsiControlBar: React.FC = () => {
  const { spaceSlug, channelSlug } = useSelector(
    (state: LynoActiveVoiceChannelRootState) => getLynoStore<LynoActiveVoiceChannelRootState>(state).activeVoiceChannel,
  );
  const activeUser = useSelector((state: LynoAuthRootState) => getLynoStore<LynoAuthRootState>(state).auth.activeUser);

  const {
    loading,
    error,
    data,
  } = useJitsiControlBarQueryQuery({
    fetchPolicy: 'no-cache',
    skip: !channelSlug,
    variables: {
      userId: activeUser,
      channelSlug,
      spaceSlug,
    },
  });

  if (!channelSlug) { return null; }
  if (error) return null;
  if (loading) return null;

  return <JitsiControlBarRenderer channel={data.channel} />;
};
