import React, { useState } from 'react';
import axios from 'axios';

// 스타일링을 위한 CSS Modules 또는 Styled Components를 사용하면 좋지만,
// 간단한 인라인 스타일로 대체했습니다.
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



const Signup: React.FC = () => {
    // 아이디, 비밀번호, 메시지를 관리할 상태
    const [username, setUsername] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);


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
        setMessage('회원가입 중...');
        setIsSuccess(false);


          

        try {
            // 서버의 /signup 엔드포인트로 POST 요청을 보냅니다.
            const response = await axios.post('http://localhost:8080/signup', {
                
                username,
                nickname,
                password
            });

            
            // 요청 성공 시
            setMessage(response.data.message);
            setIsSuccess(true);
            
            // 입력 필드 초기화
            setUsername('');
            setNickname('');
            setPassword('');

        } catch (error) {
            // 요청 실패 시
            if (axios.isAxiosError(error) && error.response) {
                setMessage(error.response.data.message || '회원가입에 실패했습니다.');
            } else {
                setMessage('네트워크 오류가 발생했습니다.');
            }
            setIsSuccess(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyles}>
            <h2>회원가입</h2>
            <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={handleUsernameChange}
                style={inputStyles}
                required
            />
            <input
                type="nickname"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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
                회원가입
            </button>
            {message && (
                <p style={{ ...messageStyles, color: isSuccess ? 'green' : 'red' }}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default Signup;