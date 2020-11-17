import React from 'react';
import { useChannelListQueryQuery } from '../../generated/types';
import { ChannelListRenderer } from './ChannelList';

export interface ChannelListProps {
  activeUser: string;
  teamId: string;
}
export const ChannelList: React.FC<ChannelListProps> = ({ activeUser, teamId }: ChannelListProps) => {
  const userResult = useChannelListQueryQuery({ variables: { userId: activeUser } });
  const spaceSlug = userResult.data?.user.spaces?.find(({ externalId }) => externalId === teamId)?.activeSlug.slug;

  if (!spaceSlug) return null;

  return <ChannelListRenderer activeUser={activeUser} spaceSlug={spaceSlug} />;
};
