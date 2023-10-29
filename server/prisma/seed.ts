import { Comment, Post, PrismaClient, User } from '@prisma/client';
import { ObjectID } from 'bson';
import casual from 'casual';

const prisma = new PrismaClient();

const MAX_USERS = 5;
const MAX_POSTS = 25;
const MAX_COMMENTS = 40;

casual.define(
  'avatar',
  () =>
    `https://source.unsplash.com/collection/9948714/300x300?${casual.integer(
      1,
      100,
    )}`,
);
casual.define('image', () => 'https://source.unsplash.com/random');
casual.define('_id', () => new ObjectID().toString());

const extendedCasual = casual as typeof casual & {
  user: User;
  comment: Comment;
  post: Post;
  avatar: string;
  image: string;
  _id: string;
};

casual.seed(123);
casual.define('comment', () => {
  return {
    id: extendedCasual._id,
    createdAt: new Date(),
    text: casual.sentences(casual.integer(1, 3)),
    updatedAt: new Date(),
  };
});

casual.define('post', () => {
  return {
    id: extendedCasual._id,
    content: casual.sentences(casual.integer(1, 10)),
    createdAt: new Date(),
    isDraft: !!casual.coin_flip,
    previewImage: extendedCasual.image,
    title: casual.title,
    likes: [],
    updatedAt: new Date(),
  };
});

casual.define('user', () => {
  return {
    id: extendedCasual._id,
    avatar: extendedCasual.avatar,
    createdAt: new Date(),
    displayName: casual.name,
    uid: casual.uuid,
    likedPosts: [],
    updatedAt: new Date(),
  };
});

const users = Array.from({ length: MAX_USERS }, () => extendedCasual.user);

const posts = Array.from({ length: MAX_POSTS }, () => ({
  ...extendedCasual.post,
  userId: (casual.random_element(users) as User).id,
}));

const comments = Array.from({ length: MAX_COMMENTS }, () => ({
  ...extendedCasual.comment,
  postId: (casual.random_element(posts) as Post).id,
  userId: (casual.random_element(users) as User).id,
}));

async function main() {
  await prisma.user.createMany({
    data: [
      ...users,
      {
        ...extendedCasual.user,
        uid: 'qNO5UJm2SsWt0oK7TMUAsdwz9fV2', // This is the uid of the user created in the firebase console
      },
    ],
  });

  await prisma.post.createMany({ data: posts });
  await prisma.comment.createMany({ data: comments });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
