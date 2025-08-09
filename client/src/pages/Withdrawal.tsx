import React, { useState } from 'react';
import AppTopstrip from '../components/AppTopstrip';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/styles.min.css';
import { useNavigate } from 'react-router-dom';

const formStyles = {
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
  },
  readOnlyInput: {
    backgroundColor: '#323b3b',
    cursor: 'not-allowed'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  deleteButton: {
    backgroundColor: '#dc3545', // 빨간색 계열
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#6c757d', // 회색 계열
    color: 'white'
  }
};

const Withdrawal = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleDelete = () => {
    if (window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      // TODO: 여기에 서버로 탈퇴 요청을 보내는 API 호출 로직을 작성합니다.
      console.log("회원탈퇴 요청", { password });
      alert('회원탈퇴가 완료되었습니다.');
      // 탈퇴 후 홈 페이지로 이동
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
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
            <h2>회원 탈퇴</h2>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>회원 아이디</label>
              <input
                type="text"
                name="memberId"
                value="king123" // 로그인한 사용자의 ID로 변경해야 함
                readOnly
                style={{...formStyles.input, ...formStyles.readOnlyInput}}
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
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.buttonGroup}>
              <button onClick={handleDelete} style={{...formStyles.button, ...formStyles.deleteButton}}>탈퇴</button>
              <button onClick={handleCancel} style={{...formStyles.button, ...formStyles.cancelButton}}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdrawal;