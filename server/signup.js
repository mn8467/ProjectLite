// signup.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { promisePool } = require('./db');

router.post('/', async (req, res, next) => {
    const { username,nickname, password } = req.body;
    
    if (!username || !nickname || !password) {
        return res.status(400).json({ message: '빈칸없이 입력해주세요.' });
    }

    try {
        // 1. 중복 사용자 확인
        const [existingUsers] = await promisePool.execute(
            'SELECT user_name FROM users WHERE user_name = ?',
            [username]
        );
        // 2. 중복 닉네임 확인
        const [existingNickname] = await promisePool.execute(
            'SELECT nickname FROM users WHERE nickname = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: '이미 존재하는 사용자 이름입니다.' });
        }

        if( existingNickname.length > 0) {
            return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
        }   
        
        // 2. 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. 회원 정보 저장
        // 컬럼명이 'password'이므로, 'password' 컬럼에 해시된 비밀번호를 저장합니다.
        const sql = 'INSERT INTO users (user_name,nickname, password) VALUES (?,?,?)';
        await promisePool.execute(sql, [username,nickname, hashedPassword]);

        // 4. 성공 응답
        res.status(201).json({ message: '회원가입 성공!' });

    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: '이미 존재하는 사용자 이름입니다.' });
        }
        next(error);
    }
});

module.exports = router;