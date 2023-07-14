const express = require('express');
const routes = require('./routes');
const port = 3000 || process.env.PORT;

const app = express();

app.use('/', routes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));