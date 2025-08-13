import type { FormEvent } from "react";
import React, { useState, useEffect } from 'react';


const BoardWrite : React.FC = () => {

    const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 실제로는 API 요청 (POST) 로직 작성
    console.log("제출 데이터:", { title, content });

    alert("글이 작성되었습니다!");
    setTitle("");
    setContent("");
  };
    return(
        <>
        
             <div className="container mt-5">
      <h1 className="mb-4">글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">제목</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">내용</label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">작성하기</button>
      </form>
    </div>
        </>
    )

}

export default BoardWrite;