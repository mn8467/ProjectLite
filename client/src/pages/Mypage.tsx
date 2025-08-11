import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    color: '#000000',
    backgroundColor: '#ffffff'
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
  },
  deleteButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px'
  },
  deleteButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#6c757d',
    color: 'white',
    fontSize: '1.1em'
  }
};

// 사용자 정보의 타입을 정의합니다.
interface UserInfo {
  memberId: string;
  nickname: string;
  password?: string; // 비밀번호는 보통 가져오지 않습니다.
}

const Mypage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    memberId: '',
    nickname: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트가 처음 렌더링될 때 사용자 정보를 가져옵니다.
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 백엔드의 사용자 정보 API 엔드포인트로 GET 요청을 보냅니다.
        // 이때 로그인 시 받은 세션 쿠키를 자동으로 포함하기 위해 withCredentials를 true로 설정합니다.
        const response = await axios.get<UserInfo>('http://localhost:8080/userinfo', {
          withCredentials: true
        });
        
        // 서버에서 받은 데이터를 상태에 저장합니다.
        setUserInfo(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
        // 사용자 정보 가져오기 실패 시 로그인 페이지로 리디렉션
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleConfirm = async () => {
    try {
      // TODO: 서버로 수정된 정보를 전송하는 API 호출 로직을 작성하세요.
      // 예시: axios.put('http://localhost:8080/userinfo', userInfo, { withCredentials: true });
      alert('회원 정보가 수정되었습니다!');
    } catch (error) {
      console.error('회원 정보 수정 실패', error);
      alert('회원 정보 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    console.log("취소 버튼 클릭됨");
    alert('수정이 취소되었습니다.');
  };

  const handleDeleteRedirect = () => {
    navigate('/withdrawal');
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>사용자 정보를 불러오는 중...</h2>
      </div>
    );
  }

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
                style={{...formStyles.input, cursor: 'not-allowed'}}
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
                value={userInfo.password || ''}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.buttonGroup}>
              <button onClick={handleConfirm} style={{...formStyles.button, ...formStyles.confirmButton}}>확인</button>
              <button onClick={handleCancel} style={{...formStyles.button, ...formStyles.cancelButton}}>취소</button>
            </div>
            <div style={formStyles.deleteButtonContainer}>
              <button onClick={handleDeleteRedirect} style={formStyles.deleteButton}>회원탈퇴</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mypage;