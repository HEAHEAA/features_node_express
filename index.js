const jwtLogin = require('./controller/jwt');
const authData = require('./controller/authData');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/login', jwtLogin.LoginPost);
app.get('/data', jwtLogin.authJWT, authData.JwtGetData );

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});

