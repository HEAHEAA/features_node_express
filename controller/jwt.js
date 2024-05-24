const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

let refreshTokens = [];

//로그인
exports.LoginPost = async(req, res) => {
    const {user_id, user_pwd} = req.body;
    if(user_id === 'test' && user_pwd === 'test'){
        const payload = {user_id};
        const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn: '24d'});
        
        refreshTokens.push(refreshToken);

        res.json({accessToken, refreshToken});
    }else{
        res.status(401).json({error: "아이디 또는 비밀번호가 틀렸습니다."});
    }
}

//토큰값 발급 refresh -> access
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

exports.authJWT = async(req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if(token){
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if(err) {return res.status(403).json({error: "잘못된 요청입니다. 토큰을 확인해주세요."})}
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







