import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '300px',
  margin: 'auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const buttonStyles: React.CSSProperties = {
  padding: '10px',
  fontSize: '16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const messageStyles: React.CSSProperties = {
  marginTop: '15px',
  textAlign: 'center',
  fontSize: '14px'
};

const Logout: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // 로그아웃 요청을 처리하는 핸들러
  const handleLogout = async () => {
    setMessage('로그아웃 중...');
    setIsSuccess(false);

    try {
      // 서버의 /logout 엔드포인트로 POST 요청을 보냅니다.
      await axios.post('http://localhost:8080/logout', {}, {
        withCredentials: true
      });
      
      setMessage('로그아웃 성공!');
      setIsSuccess(true);
      
      // 로그아웃 성공 후 로그인 페이지로 이동합니다.
      navigate('/home');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || '로그아웃에 실패했습니다.');
      } else {
        setMessage('네트워크 오류가 발생했습니다.');
      }
      setIsSuccess(false);
    }
  };

  return (
    <div style={formStyles}>
      <h2>로그아웃</h2>
      <p>정말로 로그아웃하시겠습니까?</p>
      <button onClick={handleLogout} style={buttonStyles}>
        로그아웃
      </button>
      {message && (
        <p style={{ ...messageStyles, color: isSuccess ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Logout;