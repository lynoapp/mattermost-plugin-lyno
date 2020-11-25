import { getLynoStore, LynoAuthRootState } from '@lyno/client-helpers';
import { getCurrentTeamId } from 'mattermost-redux/selectors/entities/teams';
import React from 'react';
import { useSelector } from 'react-redux';
import { useChannelListQueryQuery } from '../../generated/types';
import { ChannelListRenderer } from './ChannelList';

export const ChannelList: React.FC = () => {
  const teamId = useSelector(getCurrentTeamId);
  const activeUser = useSelector((state: LynoAuthRootState) => getLynoStore<LynoAuthRootState>(state).auth.activeUser);
  const userResult = useChannelListQueryQuery({ variables: { userId: activeUser } });
  const spaceSlug = userResult.data?.user.spaces?.find(({ externalId }) => externalId === teamId)?.activeSlug.slug;

  if (!spaceSlug) return null;

  return <ChannelListRenderer spaceSlug={spaceSlug} />;
};
