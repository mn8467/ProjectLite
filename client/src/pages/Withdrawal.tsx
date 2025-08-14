import { useState, useEffect } from 'react';
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
    backgroundColor: '#dc3545',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white'
  }
};

const Withdrawal = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [memberId, setMemberId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberId = async () => {
      try {
        const response = await axios.get('http://localhost:8080/userinfo', {
          withCredentials: true
        });
        setMemberId(response.data.memberId);
        setIsLoading(false);
      } catch (error) {
        console.error('사용자 ID를 가져오는 데 실패했습니다.', error);
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    };
    fetchMemberId();
  }, [navigate]);

  const handleDelete = async () => {
    if (password.trim() === '') {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
      return;
    }
    
    try {
        const response = await axios.delete('http://localhost:8080/withdrawal', {
            data: { password: password },
            withCredentials: true
        });

        if (response.status === 200) {
            alert(response.data.message);
            navigate('/home');
        }
    } catch (error: unknown) {
        console.error('회원 탈퇴 실패', error);
        let message = '회원 탈퇴에 실패했습니다.';
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
        }
        alert(message);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>회원 정보를 불러오는 중...</h2>
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
            <h2>회원 탈퇴</h2>
            <div style={formStyles.inputGroup}>
              <label style={formStyles.label}>회원 아이디</label>
              <input
                type="text"
                name="memberId"
                value={memberId}
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