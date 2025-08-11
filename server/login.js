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
                'SELECT user_id, user_name, password FROM users WHERE user_name = ?',
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

            return done(null, { user_id: user.user_id, username: user.user_name });
        } catch (err) {
            return done(err);
        }
    }
));

// 사용자 정보를 세션에 저장
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { user_id: user.user_id, username: user.username });
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
    failureRedirect: '/login',
    failureMessage: true
}), (req, res) => {
    // Passport.js 인증이 성공하고, req.user 객체가 생성된 후 실행됩니다.
    // 여기서 세션에 isLoggedIn을 저장합니다.
    req.session.isLoggedIn = true;
    console.log('로그인 후 세션:', req.session)
    req.session.save((err) => {
        if (err) {
            console.error('세션 저장 실패:', err);
            return res.status(500).json({ success: false, message: '세션 저장에 실패했습니다.' });
        }
        res.status(200).json({ success: true, message: '로그인 성공!' });
    });
});

module.exports = login;
