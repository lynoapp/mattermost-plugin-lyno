import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JitsiRemoteTrack from '@lyno/lib-jitsi-meet/modules/RTC/JitsiRemoteTrack';
import { FiMic, FiMicOff, FiPhoneOff } from 'react-icons/fi';
import { useLyno, JitsiMedia } from '@lyno/client-sdk';
import { getLynoStore, resetActiveVoiceChannel } from '@lyno/client-helpers';

import { LynoSDKRootState } from '@lyno/client-sdk/src/reducers';
import { JitsiControlBarQueryQueryResult } from '../../generated/types';

import './JitsiControlBar.scss';

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
    <div className="lyno-jitsi-control-bar">
      {remoteAudioTracks.map((track) => (
        <JitsiMedia
          key={track.getId()}
          track={track}
        />
      ))}
      <div className="lyno-jitsi-control-bar__info">
        <div className="lyno-jitsi-control-bar__connection">Voice Conntected:</div>
        <div className="lyno-jitsi-control-bar__channel-name">{channel.name}</div>
      </div>
      <button type="button" onClick={toggleAudio}>
        {audioMuted
          ? <FiMicOff size={16} />
          : <FiMic size={16} />}
      </button>
      <button type="button" onClick={handleHangup}>
        <FiPhoneOff size={16} />
      </button>
    </div>
  ), [audioMuted, cameraMuted, screenMuted, channel, remoteAudioTracks]);
};
