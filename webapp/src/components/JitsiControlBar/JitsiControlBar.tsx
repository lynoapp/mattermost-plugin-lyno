import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JitsiRemoteTrack from '@lyno/lib-jitsi-meet/modules/RTC/JitsiRemoteTrack';
import { FiMic, FiMicOff, FiPhoneOff } from 'react-icons/fi';
import { useLyno, JitsiMedia } from '@lyno/client-sdk';
import { getLynoStore, resetActiveVoiceChannel } from '@lyno/client-helpers';

import { JitsiControlBarQueryQueryResult } from 'generated/types';
import { LynoSDKRootState } from '@lyno/client-sdk/src/reducers';

interface JitsiControlBarProps {
  channel: JitsiControlBarQueryQueryResult['data']['channel'];
}

export const JitsiControlBarRenderer: React.FC<JitsiControlBarProps> = ({ channel }: JitsiControlBarProps) => {
  const dispatch = useDispatch();
  const { toggleAudio } = useLyno({ endpoint: process.env.JITSI_HOSTNAME, token: channel.token });
  const {
    audioMuted,
    cameraMuted,
    screenMuted,
    remoteTracks,
  } = useSelector((state: LynoSDKRootState) => ({
    audioMuted: getLynoStore<LynoSDKRootState>(state).sdk.voiceChannel.audioMuted,
    cameraMuted: getLynoStore<LynoSDKRootState>(state).sdk.voiceChannel.cameraMuted,
    screenMuted: getLynoStore<LynoSDKRootState>(state).sdk.voiceChannel.screenMuted,
    remoteTracks: getLynoStore<LynoSDKRootState>(state).sdk.remoteTracks,
  }));

  const remoteAudioTracks = React.useMemo(
    () => Object.values(remoteTracks).flat().filter((track: JitsiRemoteTrack) => track.getType() === 'audio'),
    [remoteTracks],
  );

  const handleHangup = () => dispatch(resetActiveVoiceChannel());

  return React.useMemo(() => (
    <div>
      {remoteAudioTracks.map((track) => (
        <JitsiMedia
          key={track.getId()}
          track={track}
        />
      ))}
      <button type="button" onClick={toggleAudio}>
        { audioMuted
          ? <FiMicOff size={20} />
          : <FiMic size={20} />}
      </button>
      <button type="button" onClick={handleHangup}>
        <FiPhoneOff size={20} />
      </button>
    </div>
  ), [audioMuted, cameraMuted, screenMuted, channel, remoteAudioTracks]);
};
