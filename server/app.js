// app.js
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const cors = require('cors');
const app = express();
const PORT = 8080;

const { promisePool } = require('./db');

// MySQLStore 설정
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, promisePool);

//  CORS 설정은 다른 미들웨어보다 가장 먼저 위치해야 한다고함.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// 세션 미들웨어 설정
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));


//세션 확인
app.get('/check-session', (req, res) => {
    if (req.session && req.session.isLoggedIn) {
        res.status(200).json({ isLoggedIn: true });
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(passport.initialize());
app.use(passport.session());


// [추가된 부분] 로그인한 사용자의 정보를 반환하는 API 엔드포인트
app.get('/userinfo', (req, res) => {
    // 세션에 저장된 사용자 정보가 있는지 확인
    if (req.session && req.session.userId) {
        const user = {
            memberId: req.session.userId, 
            nickname: req.session.nickname
        };
        res.status(200).json(user);
    } else {
        // 로그인하지 않은 상태라면 401 Unauthorized 응답
        res.status(401).json({ message: '로그인이 필요합니다.' });
    }
});


// 라우터 설정
const signupRouter = require('./signup');
const loginRouter = require('./login');
const logoutRouter = require('./logout');
const boardRouter = require('./controller/boardcontroller');


app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/board', boardRouter);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});