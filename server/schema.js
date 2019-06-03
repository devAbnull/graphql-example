const graphql = require("graphql");
const axios = require("axios");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const BASE_URL = 'http://localhost:3000';

const fetchFromUrl = url =>
  axios
    .get(url)
    .then(_.property("data"))
    .catch(console.error);

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return fetchFromUrl(`${BASE_URL}/companies/${parentValue.id}/users`);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return fetchFromUrl(
          `${BASE_URL}/companies/${parentValue.companyId}`
        );
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return fetchFromUrl(`${BASE_URL}/users/${args.id}`);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return fetchFromUrl(`${BASE_URL}/companies/${args.id}`);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
