const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});
const upload = multer({storage:storage});

//엑셀 파일업로드 라우트
app.post('/upload', upload.single('file'), (req, res) => {
    if(!req.file){
        return res.status(400).send('No file uploaded.');
    }

    //파일 경로
    const filepath = path.join(__dirname, 'uploads', req.file.filename);

    //파일 읽기
    const workbook = xlsx.readFile(filepath);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.SheetNames[sheet_name_list[0]]);

    //콘솔에 엑셀 데이터 출력
    console.log(xlData);

    // //파일 들어오면 삭제
    // fs.unlinkSync(filepath);

    res.send('file upload and processed success');
});

app.listen(port, () => {
    console.log(`Server is running port${port}`);
})