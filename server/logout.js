// logout.js
const express = require('express');
const logout = express.Router();


// 로그아웃 라우터
logout.post('/', (req, res, next) => {
    // Passport.js의 req.logout() 메서드를 사용하여 세션을 파기합니다.
    req.logout(err => {
        if (err) {
            return next(err);
        }
        // Passport 세션 정보 삭제 후, express-session의 세션도 파기합니다.
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ success: true, message: '로그아웃되었습니다.' });
        });
    });
});

module.exports = logout;