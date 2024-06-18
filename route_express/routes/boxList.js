const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Box list');
});

router.get('/abc', (req,res) => {
    const boxt = [
        {id: 1, status:1},
        {id: 2, status:0},
        {id: 3, status:0},
        {id: 4, status:1}
    ]
    res.send(boxt);
})
module.exports = router;