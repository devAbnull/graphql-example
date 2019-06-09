const graphql = require("graphql");
const axios = require("axios");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BASE_URL = "http://localhost:3000";

const getDataPromise = axiosPromise =>
  axiosPromise.then(_.property("data")).catch(console.error);

const fetchFromUrl = url => getDataPromise(axios.get(url));

const addOnUrl = (url, body) => getDataPromise(axios.post(url, body));

const deleteOnUrl = url => getDataPromise(axios.delete(url));

const editOnUrl = (url, body) => getDataPromise(axios.patch(url, body));

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
        return fetchFromUrl(`${BASE_URL}/companies/${parentValue.companyId}`);
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

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return addOnUrl(`${BASE_URL}/users`, args);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return deleteOnUrl(`${BASE_URL}/users/${args.id}`);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return editOnUrl(`${BASE_URL}/users/${args.id}`, args);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
