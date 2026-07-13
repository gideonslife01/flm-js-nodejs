const ejs = require('ejs');
const express = require('express');
const http = require('http');
const path = require('path');
var bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const port = 3000;

// ejs settings
app.set('view engine','ejs');
app.set('views','./public');

// 정적 디렉토리 설정 : 웹서버 파일 경로
// Static directory configuration: Web server file path
app.use(express.static('public'));

// json데이터 사용
// Use JSON data
app.use(express.json());

// 파일 업로드용
// For file upload
//app.use(express.urlencoded({ extended: true }));

// POST메소드용 parse application/x-www-form-urlencoded
// parse application/x-www-form-urlencoded for POST method
app.use(bodyParser.urlencoded({ extended: false }));

// 폼 불러오기
// Load form
app.get('/', (req, res) => {
    res.render('form')
});

// 폼 내용 처리 또는 출력
// Process or output form content
app.post('/signupProc',(req, res) => {
    const username = req.body.username;
    console.log(`폼데이터/Form Data : ${username}`);
    
    if(username){
        res.json({message: '데이터전송완료\nData transmission completed.'});
    }
})


// 서버 시작
// Start server
server.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행 중입니다.\nServer is running on port ${port}.`);
});


// module install
// npm install body-parser cors ejs express fs
