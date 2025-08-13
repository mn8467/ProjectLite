const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const cors = require('cors');
const bcrypt = require('bcrypt'); // ⭐️ [추가] bcrypt 모듈 로드
const app = express();
const PORT = 8080;
const { promisePool } = require('./db');


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

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

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
        // 세션에 로그인 정보가 있다면
        userId = req.session.passport.user.user_id;
        userName = req.session.passport.user.username;
        res.status(200).json({ isLoggedIn: true, userId, userName });
    } else {
        // 세션에 로그인 정보가 없다면
        res.status(200).json({ isLoggedIn: false });
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/userinfo', (req, res) => {
    if (req.session && req.session.memberId) {
        const user = {
            memberId: req.session.memberId, 
            nickname: req.session.nickname
        };
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: '로그인이 필요합니다.' });
    }
});

app.get('/check-nickname', async (req, res) => {
    const nickname = req.query.nickname;

    if (!nickname || nickname.trim() === '') {
        return res.status(400).json({ message: '닉네임이 입력되지 않았습니다.' });
    }
    
    if (req.session.nickname === nickname) {
        return res.status(200).json({ isAvailable: true });
    }

    try {
        const [rows] = await promisePool.execute(
            'SELECT COUNT(*) as count FROM users WHERE nickname = ?',
            [nickname]
        );
        
        const count = rows[0].count;
        
        if (count > 0) {
            res.status(200).json({ isAvailable: false });
        } else {
            res.status(200).json({ isAvailable: true });
        }
    } catch (err) {
        console.error('닉네임 중복 확인 중 오류 발생:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});


app.put('/userinfo', async (req, res) => {
    if (!req.session || !req.session.memberId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { nickname, currentPassword, newPassword } = req.body;
    const memberId = req.session.memberId;
    
    // 닉네임과 비밀번호 중 변경사항이 있는지 확인
    const isNicknameChanged = nickname !== undefined && nickname !== req.session.nickname;
    const isPasswordChanged = newPassword !== undefined && newPassword.trim() !== '';

    if (!isNicknameChanged && !isPasswordChanged) {
        return res.status(400).json({ message: '수정할 정보가 없습니다.' });
    }

    try {
        let updateQuery = 'UPDATE users SET';
        const updateValues = [];

        // 1. 닉네임 변경 로직
        if (isNicknameChanged) {
            updateQuery += ' nickname = ?,';
            updateValues.push(nickname);
        }

        // 2. 비밀번호 변경 로직
        if (isPasswordChanged) {
            if (!currentPassword) {
                return res.status(400).json({ message: '비밀번호를 변경하려면 현재 비밀번호를 입력해야 합니다.' });
            }

            // DB에서 기존 비밀번호를 가져와서 비교
            const [rows] = await promisePool.execute(
                'SELECT password FROM users WHERE user_name = ?',
                [memberId]
            );

            const user = rows[0];
            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
            }

            // 새 비밀번호 암호화
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            updateQuery += ' password = ?,';
            updateValues.push(hashedNewPassword);
        }

        // 마지막 쉼표 제거
        updateQuery = updateQuery.slice(0, -1);
        
        // WHERE 절 추가
        updateQuery += ' WHERE user_name = ?';
        updateValues.push(memberId);
        
        const [result] = await promisePool.execute(updateQuery, updateValues);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 세션 정보 업데이트
        if (isNicknameChanged) {
            req.session.nickname = nickname;
        }
        
        res.status(200).json({ success: true, message: '회원 정보가 성공적으로 수정되었습니다.' });
    } catch (err) {
        console.error('회원 정보 업데이트 중 오류 발생:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});


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