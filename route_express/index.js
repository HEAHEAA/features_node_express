const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./routes/user');
const boxRouter = require('./routes/boxList');

app.get('/', (req,res) => {
    res.send('Hello Send');
});

app.use('/user', userRouter);
app.use('/box', boxRouter);


app.listen(port, () => {
    console.log(`node-express ${port} server running`);
})