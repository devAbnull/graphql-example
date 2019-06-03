const express = require('express');
const app = express();
const expressGraphQL = require('express-graphql');
const schema = require('./schema');

const PORT = 9000;

app.get('/', (req, res) => {
  res.send('Hi its working! coool');
});

app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema
}));

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}/`);
})
