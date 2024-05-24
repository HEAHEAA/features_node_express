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

