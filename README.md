# node_jwt


### 01 로그인엑세스토큰 구현
#### #01  https://kimjihee1113.tistory.com/29

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

### 02 Token 인증 후 데이터 받기
#### #02  https://kimjihee1113.tistory.com/30
```
[ /controller/jwt.js ] 

exports.authJWT = async(req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err) {return res.sendStatus(403)}
            req.user = user;
            next();
        });
    }else{
        res.status(401).json({
            message: 'fail',
            status: true,
            data: [],
            error: "접근 권한이 없습니다."
        });
    }
};


[ controller/authData.js ]
exports.JwtGetData = async(req, res) => {
    res.json({
        message: 'success',
        status: true,
        data:[{id:1, name: '홍길동'}],
        error: null
    });
};


[ index.js ]
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
```


### 03 refresh token 발급 -> 새로운  accessToken 발급
#### #03  https://kimjihee1113.tistory.com/31

```
[ .env ]
SECRET_KEY='mykeymykey'
REFRESH_SECRET_KEY='myrefreshkey'

[ controller/jwt.js ]
//리프레시 키 .env에서 가져오기
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

//로그인
let refreshTokens = [];
exports.LoginPost = async(req, res) => {
    const {user_id, user_pwd} = req.body;
    if(user_id === 'test' && user_pwd === 'test'){
        const payload = {user_id};
        const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn: '24d'}); // 수정
        
        refreshTokens.push(refreshToken); // 수정

        res.json({accessToken, refreshToken}); //수정
    }else{
        res.status(401).json({error: "아이디 또는 비밀번호가 틀렸습니다."});
    }
}

exports.refreshJWT = async(req, res) => {
    const {token} = req.body;

    if(!token) return res.status(401).json({error: "토큰 재확인 요청"});
    if(!refreshTokens.includes(token)) return res.status(403).json({error: "잘못된 요청"});;

    jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({error: "잘못된 요청입니다. 토큰을 확인해주세요."});

        const payload = {user_id: user.user_id};
        const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '15m'});

        res.json({
            accessToken,
            message: 'success',
            status: true,
        });
    });
};


[ /controller/authData.js ]
exports.JwtGetData = async(req, res) => {
    res.json({
        message: 'success',
        status: true,
        data:[{id:1, name: '홍길동'}],
        error: null
    });
};


[ index.js ]

app.post('/refresh', jwtLogin.refreshJWT);
app.get('/data', jwtLogin.authJWT, authData.JwtGetData );
```