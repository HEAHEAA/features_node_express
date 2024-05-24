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


