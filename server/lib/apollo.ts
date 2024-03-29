import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeTypeDefinition, DateTimeResolver } from 'graphql-scalars';

import { NodeEnvs } from './enums';
import GraphQLSchema from '../../schema';
import { prisma } from '../prisma';
import { resolvers } from '../resolvers';

const schema = makeExecutableSchema({
  typeDefs: [GraphQLSchema, DateTimeTypeDefinition],
  resolvers: {
    ...resolvers,
    DateTime: DateTimeResolver,
  },
});

export const createServer = () =>
  new ApolloServer({
    schema,
    cache: 'bounded',
    introspection: process.env.NODE_ENV === NodeEnvs.Development,
  });

export const startServer = async (server: ApolloServer) => {
  await server.start();
  await prisma.$connect();
};

export const stopServer = async (server: ApolloServer) => {
  await server.stop();
  await prisma.$disconnect();
};
