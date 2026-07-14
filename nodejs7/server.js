const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// 간단한 사용자 데이터베이스 (배열) : simple user database (array)
const users = [
  { id: 1, username: 'testuser', passwordHash: '$2b$10$abKhb8aJsQ02T2TwSi0J4eVK42eRojFDTe.3EmWUQkdiXvaFVboxq' } // '11111111'의 hash
];

// 미들웨어 설정 : middleware settings
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 로그인 상태 확인 미들웨어 (모든 요청에서 실행) : middleware for loging status checking 
app.use((req, res, next) => {

  // 기본값 세팅 (로그인 안 된 상태를 가정) : Default settings (assuming the user is not logged in)
  res.locals.isLoggedIn = false;
  res.locals.userid = "";
  res.locals.name = "";
  res.locals.loggedInUser = null;

  // 로그인 세션(member)이 존재하는 경우 데이터 채워넣기 : If the login session (member) exists, fill in the data
  if (req.session.member) {
    res.locals.isLoggedIn = true;
    res.locals.userid = req.session.member.userid;
    res.locals.name = req.session.member.name;
    
    // 데이터베이스(users 배열)에서 로그인한 유저 객체 찾아서 넣어주기
     // Find the logged-in user object in the database (users array) and assign it.
    res.locals.loggedInUser = users.find(user => user.username === req.session.member.userid) || null;
  }

  next(); // 다음 라우터로 ... / To the next router...
});


// 뷰 엔진 설정 (ejs 사용) : 'view engine settings(use ejs)
app.set('view engine', 'ejs');
app.set('views', './public');

// 정적 파일 제공 (css 등) : static file setting (css) 
app.use(express.static('public'));

// bcrypt패스워드 생성 : generate bcrype password
async function generateHash(password) {
  try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      console.log("해시된 비밀번호/Hashed password:", hash);
      return hash;
  } catch (err) {
      console.error("해싱 오류/Hashing error:", err);
  }
}



// 루트 라우터 : root router
app.get('/', (req, res) => {
  res.render('login');
});

// 로그인 폼 표시 :  login form 
app.get('/login', (req, res) => {
  res.render('login');
});



// 로그인 처리 : login process
app.post('/loginProc', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  // generate bcrypt password
  const bbcrypt = await generateHash(password);
  //console.log(bbcrypt);
  
  
  if (!user) {
    return res.send('로그인 실패 /login failed: , 사용자 없음 / cannot find user');
  }

  // search user
  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (isMatch) {
    req.session.member = {
      userid: req.body.username, // 
      name: 'anomymous' // 
  };
    res.redirect('/');
  } else {
    res.send('로그인 실패 / login failed: ,비밀번호 불일치 / password error');
  }
});

// 로그아웃 처리 : logout process
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패 / session delete failed:', err);
      res.send('로그아웃 실패 / logout failed');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.\nServer is running at http://localhost:${port}`);
});

// npm install express express-session bcrypt ejs
