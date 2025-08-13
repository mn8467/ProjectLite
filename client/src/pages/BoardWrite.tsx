import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckLogin from '../components/CheckLogin'; // 로그인 상태를 확인하는 훅을 임포트합니다.


const BoardWrite: React.FC = () => {
    const { isLoggedIn, isLoading ,setIsLoggedIn ,setNickname, setUserId  } = CheckLogin();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'danger' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  

    setIsSubmitting(true);
    setMessage(null);

    const boardData = {
        userId: setUserId,
        nickname: setNickname,
        title: title,
        content: content
    };

    try {
        const response = await fetch('http://localhost:8080/board/write-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData),
        });

        if (response.ok) {
            console.log('게시글 작성 성공!');
            setMessage({ text: '글이 성공적으로 작성되었습니다!', type: 'success' });
            setTitle('');
            setContent('');
        } else {
            console.error('게시글 작성 실패!');
            setMessage({ text: '글 작성에 실패했습니다. 다시 시도해 주세요.', type: 'danger' });
        }
    } catch (error) {
        console.error('네트워크 오류:', error);
        setMessage({ text: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', type: 'danger' });
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <Card className="shadow-lg p-4 p-md-5 w-100 border-0 rounded-3" style={{ maxWidth: '800px' }}>
                <h1 className="fs-3 fw-bolder text-dark mb-4">새 글 작성</h1>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="boardTitle">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            required
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="boardContent">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={8}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            required
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-pill px-4"
                    >
                        {isSubmitting ? '작성 중...' : '작성하기'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default BoardWrite;
