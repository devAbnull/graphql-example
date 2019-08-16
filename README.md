# Understanding GraphQL

**GraphQL** ( Graph Query Language ) is a query language for APIs and a server-side runtime for executing queries by using a type system you define for your data.

In REST APIs, there's clearly a defined structure of information returned from each endpoint (like to fetch posts endpoint would be like _http://some.api.com/posts_). GraphQL always exposes only one endpoint, allowing the client to decide what data it really needs from a predefined pattern.

## Query

Queries are used to make requests for data from the server. As seen in below example, the query has exactly the same shape as the result.

Example for query:

```
{
  me {
    name
  }
}

```

returns a JSON:

```
{
  "me": {
    "name": "Morty"
  }
}
```

## Mutations

In GraphQL, Mutations are used to modify data on server. **mutation** is just a keyword.
Technically any query could be implemented to update data. However, it's an established convention that any operations that causes writes should be sent explicitly via a mutation.

Mutations are really much like the query objects, they too have a type, arguments and a resolve function.

Just like in queries, if the mutation field returns an object type, nested fields can also be fetched.

example for mutation:

```
mutation {
  addUser(firstName: "AB", age:23, companyId:"2") {
    id
    firstName
    company {
      name
    }
  }
}
```

_for more details_ checkout official docs at https://graphql.org/learn/
