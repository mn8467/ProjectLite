import React, { useState, useEffect } from 'react'; // ⭐️ [추가된 부분] useEffect를 추가합니다.
import axios from 'axios'; // ⭐️ [추가된 부분] API 호출을 위해 axios를 임포트합니다.
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

// ⭐️ [추가된 부분] 사용자 정보의 타입을 정의합니다.
interface UserInfo {
  memberId: string;
  nickname: string;
  password?: string;
}

const Mypage = () => {
  const navigate = useNavigate();
  // ⭐️ [수정된 부분] useState의 초기값을 빈 문자열로 변경하고 타입을 정의합니다.
  const [userInfo, setUserInfo] = useState<UserInfo>({
    memberId: '',
    nickname: '',
  });
  // ⭐️ [추가된 부분] 데이터 로딩 상태를 관리하는 state를 추가합니다.
  const [isLoading, setIsLoading] = useState(true);

  // ⭐️ [추가된 부분] 컴포넌트가 처음 렌더링될 때 사용자 정보를 가져옵니다.
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get<UserInfo>('http://localhost:8080/userinfo', {
          withCredentials: true
        });
        
        setUserInfo(response.data);
        setIsLoading(false); // 로딩 완료
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
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
      // ⭐️ [수정된 부분] axios.put을 이용해 백엔드 API에 수정 요청을 보냅니다.
      const response = await axios.put('http://localhost:8080/userinfo', {
          nickname: userInfo.nickname
      }, {
          withCredentials: true
      });

      if (response.status === 200) {
          alert('회원 정보가 수정되었습니다!');
          // 성공 시, 서버에서 받은 최신 정보로 상태를 업데이트할 수도 있습니다.
      }
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

  // ⭐️ [추가된 부분] 로딩 중일 때 다른 화면을 보여주는 조건부 렌더링입니다.
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