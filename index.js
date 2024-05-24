const jwtLogin = require('./controller/jwt');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/login', jwtLogin.LoginPost);

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});

