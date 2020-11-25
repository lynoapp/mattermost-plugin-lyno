import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiLock, FiVolume2 } from 'react-icons/fi';

import { VoiceUserList } from '@lyno/components';
import { useActiveVoiceUsers } from '@lyno/client-hooks';
import {
  LynoActiveVoiceChannelRootState,
  resetActiveVoiceChannel,
  getLynoStore,
  setActiveVoiceChannel,
  LynoAuthRootState,
} from '@lyno/client-helpers';

import {
  ChannelListSubscriptionDocument,
  ChannelListSubscriptionSubscription,
  MutationType,
  useChannelListRendererQueryQuery,
} from '../../generated/types';

import './ChannelList.scss';

interface ChannelListRendererProps {
  spaceSlug: string;
}

export const ChannelListRenderer: React.FC<ChannelListRendererProps> = ({ spaceSlug }: ChannelListRendererProps) => {
  const dispatch = useDispatch();
  const activeUser = useSelector((state: LynoAuthRootState) => getLynoStore<LynoAuthRootState>(state).auth.activeUser);
  const { channelSlug } = useSelector(
    (state: LynoActiveVoiceChannelRootState) => getLynoStore<LynoActiveVoiceChannelRootState>(state).activeVoiceChannel,
  );

  const {
    loading, error, data, subscribeToMore,
  } = useChannelListRendererQueryQuery({
    fetchPolicy: 'cache-and-network',
    skip: !spaceSlug,
    variables: {
      userId: activeUser,
      spaceSlug,
    },
  });

  const [
    activeVoiceUserState,
    reconnectActiveVoiceUserState,
  ] = useActiveVoiceUsers({ userId: activeUser, spaceSlug });

  useEffect(() => {
    const subscribeToChannels = () => subscribeToMore<ChannelListSubscriptionSubscription>({
      document: ChannelListSubscriptionDocument,
      variables: {
        userId: activeUser,
        spaceSlug,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data || !prev.channels) { return prev; }

        const { mutation, node, previousValues } = subscriptionData.data.channel;

        if (mutation === MutationType.Deleted) {
          const active = previousValues.slug === channelSlug;

          if (active) {
            dispatch(resetActiveVoiceChannel());
          }

          return {
            ...prev,
            channels: [...prev.channels.filter((channel) => channel.id !== previousValues.id)],
          };
        }

        if (mutation === MutationType.Created) {
          reconnectActiveVoiceUserState();

          return {
            ...prev,
            channels: [...prev.channels, node],
          };
        }

        return prev;
      },
    });

    return subscribeToChannels();
  }, []);

  if (error) return null;
  if (loading && !data) return null;

  const handleSetActiveVoiceChannel = (channelSlug: string) => {
    dispatch(setActiveVoiceChannel({
      spaceSlug,
      channelSlug,
      userId: activeUser,
    }));
  };

  return (
    <ul className="lyno-channel-list">
      {data?.channels.map(({
        id,
        name,
        slug,
        secured,
        isMember,
      }) => (
        <li key={id}>
          <button
            type="button"
            onClick={() => handleSetActiveVoiceChannel(slug)}
          >
            {
              secured && !isMember
                ? <FiLock size={14} />
                : <FiVolume2 size={16} />
            }
            {name}

          </button>
          <VoiceUserList
            users={activeVoiceUserState[id]}
            spaceSlug={spaceSlug}
            channelSlug={slug}
          />
        </li>
      ))}
    </ul>
  );
};
