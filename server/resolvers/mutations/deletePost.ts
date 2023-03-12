import { MutationResolvers } from '../../../generated/server';
import { checkUserPermissionsOrThrow } from '../../lib/utils';
import { prisma } from '../../prisma';

export const deletePost: MutationResolvers['deletePost'] = async (
  parent,
  { input },
  { user },
) => {
  checkUserPermissionsOrThrow(user);

  // TODO: Consider deleteing (reactions - todo) and comments too
  const post = await prisma.post.delete({
    where: {
      idUserId: {
        id: input.id,
        userId: user.id,
      },
    },
  });

  return post.id;
};
