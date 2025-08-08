// app.js
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); // express-mysql-session 임포트
const passport = require('passport');
const cors = require('cors');
const app = express();
const PORT = 8080;


const { promisePool } = require('./db');

// MySQLStore 설정
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000, // 15분마다 만료된 세션 정리
    expiration: 86400000, // 24시간
    createDatabaseTable: true, // 테이블이 없으면 자동으로 생성
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, promisePool); // db.js의 promisePool을 직접 전달

// 세션 미들웨어 설정
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // MySQLStore 사용
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // 24시간
    }
}));

//세션 확인
app.get('/check-session', (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        // 세션에 로그인 정보가 있다면
        res.status(200).json({ isLoggedIn: true });
    } else {
        // 세션에 로그인 정보가 없다면
        res.status(200).json({ isLoggedIn: false });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(passport.initialize());
app.use(passport.session());


// CORS 설정: 이 부분을 다시 추가해야 합니다.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


// 라우터 설정
const signupRouter = require('./signup');
const loginRouter = require('./login');
const logoutRouter = require('./logout');

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});