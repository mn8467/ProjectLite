const express = require('express');
const logout = express.Router();

logout.post('/', (req, res, next) => {
  // passport 0.6 이상이면 콜백 없이 가능
  req.logout(err => {
    if (err) return next(err);

    req.session.destroy(err => {
      if (err) return next(err);

      res.clearCookie('connect.sid'); // 세션 쿠키 제거
      res.status(200).json({ success: true, message: '로그아웃되었습니다.' });
    });
  });
});

module.exports = logout;