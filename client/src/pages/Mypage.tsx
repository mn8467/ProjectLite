import React, { useState } from 'react';
import AppTopstrip from '../components/AppTopstrip';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../assets/css/styles.min.css';
import '../assets/images/logos/logo-wrappixel.svg'
import '../assets/images/logos/logo.svg'

// 이 페이지에서만 사용하는 간단한 스타일
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
    backgroundColor: '#e9ecef',
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
  confirmButton: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white'
  }
};

const Mypage = () => {
  const [userInfo, setUserInfo] = useState({
    memberId: 'king123',
    nickname: '즐라탄',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleConfirm = () => {
    console.log("확인 버튼 클릭됨", userInfo);
    // TODO: 여기에 서버로 수정된 정보를 전송하는 API 호출 로직을 작성하세요.
    alert('회원 정보가 수정되었습니다!');
  };

  const handleCancel = () => {
    console.log("취소 버튼 클릭됨");
    // TODO: 여기에 취소 버튼 클릭 시 실행할 로직(예: 이전 페이지로 이동)을 작성하세요.
    alert('수정이 취소되었습니다.');
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
            <h2>회원 정보 수정</h2>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>회원 아이디</label>
              <input 
                type="text" 
                name="memberId"
                value={userInfo.memberId}
                readOnly
                style={{...formStyles.input, ...formStyles.readOnlyInput}}
              />
            </div>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>닉네임</label>
              <input 
                type="text" 
                name="nickname"
                value={userInfo.nickname}
                onChange={handleChange}
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>비밀번호</label>
              <input 
                type="password" 
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.buttonGroup}>
              <button onClick={handleConfirm} style={{...formStyles.button, ...formStyles.confirmButton}}>확인</button>
              <button onClick={handleCancel} style={{...formStyles.button, ...formStyles.cancelButton}}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mypage;