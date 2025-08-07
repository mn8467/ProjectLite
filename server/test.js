// test.js
const { getUsers } = require('./db'); // 파일 이름에 따라 다르게 변경

(async () => {
  try {
    const users = await getUsers();
    console.log('✅ 연결 성공! 유저 목록:', users);
  } catch (error) {
    console.error('❌ 연결 실패 또는 쿼리 에러:', error);
  }
})();