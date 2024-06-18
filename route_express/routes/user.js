const express = require('express');
const router = express.Router();

//사용자 목록 가져오기
router.get('/', (req,res) => {
    res.send('User list');
})

//특정 사용자 목록 가져오기
router.get('/:id', (req,res) => {
    console.log(req.params.id + ' 안녕');
    res.send(`ID : ${req.params.id}님 안녕하세요`);
})

module.exports = router;