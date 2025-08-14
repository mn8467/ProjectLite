import React, { useState } from 'react';
import axios from 'axios';
import AppTopstrip from '../components/AppTopstrip';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/styles.min.css';
import { useNavigate } from 'react-router-dom';

const formStyles: {
    container: React.CSSProperties;
    inputGroup: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
    button: React.CSSProperties;
    link: React.CSSProperties;
} = {
  container: {
    maxWidth: '500px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#000000',
    backgroundColor: '#ffffff'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  link: {
    display: 'block',
    marginTop: '10px',
    textAlign: 'right',
    color: '#007bff',
    textDecoration: 'none'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        memberId,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate('/home');
      } else {
        alert(response.data.message);
      }
    } catch (error: unknown) {
      console.error('로그인 실패', error);
      let message = '로그인 요청에 실패했습니다.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      alert(message);
    }
  };

  return (
    <>
      <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        <AppTopstrip />
        <Sidebar />
      </div>
      <div className="body-wrapper">
        <Header />
        <div className="container-fluid">
          <div style={formStyles.container}>
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>아이디</label>
                <input
                  type="text"
                  name="memberId"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="아이디를 입력하세요"
                  required
                  style={formStyles.input}
                />
              </div>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  style={formStyles.input}
                />
              </div>
              <button type="submit" style={formStyles.button}>로그인</button>
            </form>
            <a href="/signup" style={formStyles.link}>회원가입</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;