import { buildSchema } from 'graphql';

const schema = buildSchema(`
  scalar DateTime

  enum Role {
    USER
    ADMIN
  }

  type User {
    avatar: String!
    createdAt: DateTime!
    displayName: String
    id: ID!
    uid: ID!
    inactive: Boolean!
    updatedAt: DateTime!
    posts(input: PaginationInput): PostConnection!
    comments(input: PaginationInput): CommentConnection!
    role: Role!
    likedPosts: [ID!]
  }

  type Post {
    content: String
    createdAt: DateTime
    comments: [Comment!]
    id: ID!
    isDraft: Boolean!
    title: String!
    updatedAt: DateTime
    previewImage: String
    images: [String!]
    upvotes: Int!
    likedByCurrentUser: Boolean!
    user: User!
    likes: [ID!]
  }

  type Comment {
    createdAt: DateTime
    id: ID!
    post: Post!
    text: String!
    updatedAt: DateTime
    upvotes: Int
    user: User!
  }

  input CreateUserInput {
    avatar: String
    displayName: String
  }

  input UpdateUserInput {
    avatar: String
    displayName: String
  }

  input CreatePostInput {
    title: String!
    content: String
    previewImage: String
    images: [String!]
  }

  input UpdatePostInput {
    id: ID!
  }

  input PublishPostInput {
    id: ID!
  }

  input DeletePostInput {
    id: ID!
  }

  input ToggleLikePostInput {
    id: ID!
  }

  input CreateCommentInput {
    postId: ID!
    text: String!
  }

  input UpdateCommentInput {
    id: ID!
    text: String!
  }

  input DeleteCommentInput {
    id: ID!
  }

  input PostInput {
    id: ID!
  }

  type PageInfo {
    cursor: String
    hasMore: Boolean!
  }

  type CommentEdge {
    cursor: String!
    node: Comment!
  }

  type PostEdge {
    cursor: String!
    node: Post!
  }

  type UserEdge {
    cursor: String!
    node: User!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
  }

  input PaginationInput {
    first: Int
    after: String
  }

  input UserInput {
    uid: ID!
  }

  type Query {
    currentUser: User
    user(input: UserInput!): User
    users(input: PaginationInput): UserConnection!
    posts(input: PaginationInput): PostConnection!
    comments(input: PaginationInput): CommentConnection!
    post(input: PostInput!): Post
  }

  type Mutation {
    updateUser(input: UpdateUserInput!): User
    deleteUser: User

    createPost(input: CreatePostInput!): Post
    updatePost(input: UpdatePostInput!): Post
    publishPost(input: PublishPostInput!): Post
    deletePost(input: DeletePostInput!): ID
    toggleLikePost(input: ToggleLikePostInput!): Post

    createComment(input: CreateCommentInput!): Comment
    updateComment(input: UpdateCommentInput!): Comment
    deleteComment(input: DeleteCommentInput!): ID
  }
`);

export default schema;
