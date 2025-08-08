import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// Styling is reused from the signup form for consistency.
const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const inputStyles: React.CSSProperties = {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

const buttonStyles: React.CSSProperties = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
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



const Login: React.FC = () => {
    // 아이디, 비밀번호, 메시지를 관리할 상태
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // 영문과 숫자만 허용하는 정규식
            const alphanumericOnly = /^[a-zA-Z0-9]*$/;
            const inputValue = e.target.value;
    
            // 입력값이 정규식에 맞는지 확인
            if (alphanumericOnly.test(inputValue)) {
                setUsername(inputValue);
            }
        };
    
    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        setMessage('로그인 중...');
        setIsSuccess(false);

        try {
            // 서버의 /login 엔드포인트로 POST 요청을 보냅니다.
           const response = await axios.post(
                  'http://localhost:8080/login',
                  {
                    username,
                    password
                  },
                  {
                    withCredentials: true // 🔥 추가!
                  }
                );
            
            // 요청 성공 시
            setMessage(response.data.message);
            setIsSuccess(true);
            
            // 입력 필드 초기화
            setUsername('');
            setPassword('');
            
            // 로그인 성공 후 페이지 이동 로직 추가 가능
           navigate('/home'); // 예: 홈 페이지로 이동

        } catch (error) {
            // 요청 실패 시
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message || '로그인에 실패했습니다.');
            } else {
                setMessage('네트워크 오류가 발생했습니다.');
            }
            setIsSuccess(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyles}>
            <h2>로그인</h2>
            <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={handleUsernameChange}
                style={inputStyles}
                required
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyles}
                required
            />
            
            <button type="submit" style={buttonStyles}>
                로그인
            </button>
            {message && (
                <p style={{ ...messageStyles, color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default Login;