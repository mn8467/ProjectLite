// login.js
const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { promisePool } = require('./db');

// LocalStrategy를 이용한 인증 로직
passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const [rows] = await promisePool.execute(
                'SELECT user_name, password FROM users WHERE user_name = ?',
                [username]
            );

            const user = rows[0];

            if (!user) {
                return done(null, false, { message: '아이디가 존재하지 않습니다.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
            // 인증 성공: user 객체를 반환합니다.
            // 이 객체는 serializeUser로 전달됩니다.
            return done(null, { id: user.id, username: user.user_name });
        } catch (err) {
            return done(err);
        }
    }
));

// 사용자 정보를 세션에 저장
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

// 세션에 저장된 정보를 바탕으로 사용자 객체 복원
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

// 로그인 라우터
login.post('/', passport.authenticate('local', {
    failureRedirect: '/login', // 로그인 실패 시 리다이렉트 (프론트에서 처리하므로 필요 없을 수도 있습니다)
    failureMessage: true
}), (req, res) => {
    // Passport.js 인증 성공 후 이 미들웨어가 실행됩니다.
    // 여기서 세션에 로그인 상태를 명시적으로 저장합니다.
    req.session.isLoggedIn = true;
    req.session.save(() => {
        // 클라이언트에 성공 응답을 보냅니다.
        res.status(200).json({ success: true, message: '로그인 성공!' });
    });
});

module.exports = login;