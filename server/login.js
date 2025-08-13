// login.js
const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { promisePool } = require('./db');

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            // 로그인 아이디 컬럼인 `user_name`으로 사용자를 조회
            const [rows] = await promisePool.execute(
                'SELECT user_id, user_name, nickname, password FROM users WHERE user_name = ?',
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
            
            return done(null, { user_id: user.user_id, user_name: user.user_name, nickname: user.nickname });
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { user_name: user.user_name, nickname: user.nickname });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
}); 

login.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true
}), (req, res) => {
    req.session.isLoggedIn = true;
    // 세션의 `memberId`에 로그인 아이디인 `user_name` 값을 저장
    req.session.memberId = req.user.user_name; 
    req.session.nickname = req.user.nickname;
    
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