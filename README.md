# node_jwt
#### blog https://kimjihee1113.tistory.com/29

### 01 로그인엑세스토큰 구현


```
[ cmd ] 
$ npm i body-parser;
$ npm i dotenv;
$ npm i express;
$ npm i jsonwebtoken;
$ npm i nodemon; //선택가능

[ index.js ]
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


[ controller/jwt.js ]
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

exports.LoginPost = async(req, res) => {
    const {user_id, user_pwd} = req.body;
    if(user_id === 'test' && user_pwd === 'test'){
        const payload = {user_id};
        const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '10m'});
        res.json({accessToken});
    }else{
        res.status(401).json({error: "아이디 또는 비밀번호가 틀렸습니다."});
    }
}



[ .env ]
SECRET_KEY='mykeymykey'
```


