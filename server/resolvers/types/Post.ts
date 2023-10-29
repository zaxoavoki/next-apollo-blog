import { checkUserPermissionsOrThrow } from 'server/lib/utils';

import { PostResolvers } from '../../../generated/server';
import { prisma } from '../../prisma';

export const Post: PostResolvers = {
  user: parent => {
    return prisma.user.findUniqueOrThrow({
      where: { id: parent.userId },
    });
  },
  comments: parent => {
    return prisma.comment.findMany({
      where: { postId: parent.id },
    });
  },
  likedByCurrentUser: (parent, _, { user }) => {
    checkUserPermissionsOrThrow(user);
    return parent.likes.includes(user.id);
  },
};
