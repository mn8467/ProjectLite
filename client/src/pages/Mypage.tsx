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
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  checkButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#6c757d',
    color: 'white'
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

interface UserInfo {
  memberId: string;
  nickname: string;
}

const Mypage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    memberId: '',
    nickname: '',
  });
  const [passwords, setPasswords] = useState({
      currentPassword: '',
      newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [originalNickname, setOriginalNickname] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get<UserInfo>('http://localhost:8080/userinfo', {
          withCredentials: true
        });
        
        setUserInfo(response.data);
        setOriginalNickname(response.data.nickname);
        setIsLoading(false);
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
    if (name === 'nickname') {
        setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
        setIsNicknameAvailable(null);
    } else {
        setPasswords(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckNickname = async () => {
    if (userInfo.nickname.trim() === '') {
        alert('닉네임을 입력해 주세요.');
        return;
    }
    
    if (userInfo.nickname === originalNickname) {
        setIsNicknameAvailable(true);
        alert('기존 닉네임과 동일합니다.');
        return;
    }

    try {
        const response = await axios.get('http://localhost:8080/check-nickname', {
            params: { nickname: userInfo.nickname },
            withCredentials: true
        });

        if (response.data.isAvailable) {
            alert('사용 가능한 닉네임입니다.');
            setIsNicknameAvailable(true);
        } else {
            alert('이미 사용 중인 닉네임입니다.');
            setIsNicknameAvailable(false);
        }
    } catch (error) {
        console.error('닉네임 중복 확인 실패', error);
        alert('닉네임 중복 확인에 실패했습니다.');
        setIsNicknameAvailable(false);
    }
  };

  const handleConfirm = async () => {
    const isNicknameChanged = userInfo.nickname !== originalNickname;
    if (isNicknameChanged && isNicknameAvailable !== true) {
        alert('닉네임 중복 확인을 먼저 완료해 주세요.');
        return;
    }

    const isPasswordChanged = passwords.newPassword.trim() !== '';
    if (isPasswordChanged && passwords.currentPassword.trim() === '') {
        alert('새 비밀번호를 설정하려면 현재 비밀번호를 입력해야 합니다.');
        return;
    }
    
    if (!isNicknameChanged && !isPasswordChanged) {
        alert('수정된 정보가 없습니다.');
        return;
    }

    try {
        const response = await axios.put('http://localhost:8080/userinfo', {
            nickname: isNicknameChanged ? userInfo.nickname : undefined,
            currentPassword: isPasswordChanged ? passwords.currentPassword : undefined,
            newPassword: isPasswordChanged ? passwords.newPassword : undefined,
        }, {
            withCredentials: true
        });

        if (response.status === 200) {
            alert('회원 정보가 수정되었습니다!');
            setOriginalNickname(userInfo.nickname);
            setIsNicknameAvailable(null);
            setPasswords({ currentPassword: '', newPassword: '' });
            navigate('/home');
        }
    } catch (error: unknown) {
        console.error('회원 정보 수정 실패', error);
        let message = '회원 정보 수정에 실패했습니다.';
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
        }
        alert(message);
    }
  };

  const handleCancel = () => {
    setUserInfo(prevInfo => ({ ...prevInfo, nickname: originalNickname }));
    setIsNicknameAvailable(null);
    setPasswords({ currentPassword: '', newPassword: '' });
    alert('수정이 취소되었습니다.');
    navigate('/home');
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
              <div style={formStyles.inputContainer}>
                <input
                  type="text"
                  name="nickname"
                  value={userInfo.nickname}
                  onChange={handleChange}
                  style={{ ...formStyles.input, width: 'calc(100% - 110px)' }}
                />
                <button
                  onClick={handleCheckNickname}
                  style={formStyles.checkButton}
                >
                  중복 체크
                </button>
              </div>
              {isNicknameAvailable === true && (
                <p style={{ color: 'green', marginTop: '5px' }}>사용 가능한 닉네임입니다.</p>
              )}
              {isNicknameAvailable === false && (
                <p style={{ color: 'red', marginTop: '5px' }}>이미 사용 중인 닉네임입니다.</p>
              )}
            </div>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>현재 비밀번호</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호를 입력하세요"
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>새 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="변경할 비밀번호를 입력하세요"
                style={formStyles.input}
              />
            </div>
            <div style={formStyles.buttonGroup}>
              <button
                onClick={handleConfirm}
                style={{
                  ...formStyles.button,
                  ...formStyles.confirmButton
                }}
              >
                확인
              </button>
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