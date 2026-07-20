const express = require('express');
const url = require('url');
const app = express();
const port = 3000;

// body-parser POST 요청을 위한 미들웨어 추가 / body-parser for POST request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 간단한 사용자 데이터베이스 (배열) / simple user database (array)
const users = [
    { id: 1, username: 'testuser', passwordHash: '$2b$10$abKhb8aJsQ02T2TwSi0J4eVK42eRojFDTe.3EmWUQkdiXvaFVboxq' }, // '11111111'의 hash
    { id: 2, username: 'testuser2', passwordHash: '$2b$10$abKhb8aJsQ02T2TwSi0J4eVK42eRojFDTe.3EmWUQkdiXvaFVboxq' }, // '11111111'의 hash
];

// 아이디 중복 확인 라우트 / Route to check for duplicate IDs
app.get('/checkUsername', async (req, res) => {
    const { username } = req.query;
    console.log(`${username} 확인 요청 / Request to check ${username}`);

    // search username
    const isDuplicate = users.some(user => user.username === username);
    console.log(isDuplicate);
    if (isDuplicate) {
        return res.status(200).json({ available: false, message: '이미 사용 중인 아이디입니다. / The username is already in use.' });
    } else {
        return res.status(200).json({ available: true, message: '사용 가능한 아이디입니다. / The username is available.' });
    }
});

// 앱 회원가입 처리 라우트 / App signup registration processing route
app.post('/AppsignupProc', async (req, res) => {
    const { username, email, password, name, phone, address, birthdate, role } = req.body;

    // 유효성 검사 부분 / Validation
    if (!username || !email || !password || !name || !phone || !address || !birthdate || !role) {
        return res.status(400).json({ message: '모든 필수 정보를 입력해주세요. / Please fill in all required information.' });
    }

    // 데이터베이스 처리 로직 부분  / Database processing logic (needs actual DB connection)
    console.log(`${username}, ${email}, ${password},${name},${phone},${address},${birthdate},${role}`);

    // 임시 응답 (실제 DB 저장 로직 구현 필요) / Temporary response (needs actual DB saving logic)
    res.json({ message: '회원가입 처리 완료 / Signup completed successfully.' });
});

// 서버 시작 / server start
app.listen(port, () => {
    console.log(`Express 서버가 http://localhost:${port} 에서 실행 중입니다.\nExpress server is running at http://localhost:${port}`);
});