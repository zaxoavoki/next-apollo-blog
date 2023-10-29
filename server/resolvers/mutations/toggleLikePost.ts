import { MutationResolvers } from 'generated/server';
import { checkUserPermissionsOrThrow } from 'server/lib/utils';
import { prisma } from 'server/prisma';

export const toggleLikePost: MutationResolvers['toggleLikePost'] = async (
  _,
  { input },
  { user },
) => {
  checkUserPermissionsOrThrow(user);
  const post = await prisma.post.findFirstOrThrow({
    where: { id: input.id },
    select: { likes: true },
  });
  const updatedLikes = post.likes.includes(user.id)
    ? post.likes.filter(id => id !== user.id)
    : [...post.likes, user.id];
  return prisma.post.update({
    where: { id: input.id },
    data: { likes: updatedLikes },
  });
};
