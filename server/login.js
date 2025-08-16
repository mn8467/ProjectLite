// login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { promisePool } = require('./db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'memberId',
    passwordField: 'password'
}, async (memberId, password, done) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT user_name, password, nickname, status FROM users WHERE user_name = ?',
            [memberId]
        );

        const user = rows[0];

        if (!user) {
            return done(null, false, { message: '존재하지 않는 아이디입니다.' });
        }
        
        if (user.status === 'inactive') {
            return done(null, false, { message: '탈퇴한 회원입니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.user_name);
});

passport.deserializeUser(async (memberId, done) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT user_name, nickname, status FROM users WHERE user_name = ?',
            [memberId]
        );
        const user = rows[0];
        
        if (user && user.status === 'inactive') {
            return done(null, false);
        }
        
        done(null, user);
    } catch (err) {
        console.error('사용자 세션 역직렬화 중 오류 발생:', err);
        done(err);
    }
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: '로그인 처리 중 오류가 발생했습니다.' });
            }
            req.session.memberId = user.user_name;
            req.session.nickname = user.nickname;
                req.session.isLoggedIn = true;
            return res.status(200).json({ success: true, message: '로그인에 성공했습니다.', user: user });
        });
    })(req, res, next);
});

module.exports = router;