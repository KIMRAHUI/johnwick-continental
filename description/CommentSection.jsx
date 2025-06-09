import { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentSection.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState('');
  const [text, setText] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');

  // 🔄 새로고침 후에도 닉네임, 전용 코드 유지하기 위해 localStorage에서 복원
  useEffect(() => {
    const savedNickname = localStorage.getItem('commentNickname');
    const savedAccessCode = localStorage.getItem('commentAccessCode');
    if (savedNickname) setNickname(savedNickname);
    if (savedAccessCode) setAccessCode(savedAccessCode);
  }, []);

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/posts/${postId}/comments`);
      if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        console.error('❌ 댓글 응답이 배열이 아님:', res.data);
      }
    } catch (err) {
      console.error('❌ 댓글 불러오기 실패:', err.message);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  // 닉네임 입력 변경 + localStorage 저장
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    localStorage.setItem('commentNickname', e.target.value);
  };

  // 전용 코드 입력 변경 + localStorage 저장
  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
    localStorage.setItem('commentAccessCode', e.target.value);
  };

  // 댓글 작성
  const handleSubmit = async () => {
    if (!nickname || !text || !accessCode) {
      alert('댓글 작성을 위해 닉네임과 전용 코드를 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/posts/${postId}/comments`, {
        content: text,
        author: nickname,
        access_code: accessCode,
      });
      setText('');
      fetchComments();
    } catch (err) {
      alert('❌ 댓글 작성 실패');
    }
  };

  // 댓글 수정 시작
  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditedText(comment.content);
  };

  // 댓글 수정 저장 (수정 시 전용 코드 입력 요청)
  const handleSave = async (commentId) => {
    const inputCode = prompt('수정을 위한 전용 코드를 입력해주세요');
    if (!inputCode) return;

    try {
      await axios.patch(`${API_BASE}/api/posts/${postId}/comments/${commentId}`, {
        content: editedText,
        author: nickname,
        access_code: inputCode,
      });
      setEditingId(null);
      setEditedText('');
      fetchComments();
    } catch (err) {
      alert('❌ 댓글 수정 실패: 전용 코드가 잘못되었을 수 있습니다.');
    }
  };

  // 댓글 수정 취소
  const handleCancel = () => {
    setEditingId(null);
    setEditedText('');
  };

  // 댓글 삭제 (삭제 시 전용 코드 입력 요청)
  const handleDelete = async (commentId) => {
    const inputCode = prompt('댓글 삭제를 위한 전용 코드를 입력해주세요');
    if (!inputCode) return;

    try {
      await axios.delete(`${API_BASE}/api/posts/${postId}/comments/${commentId}`, {
        data: {
          author: nickname,
          access_code: inputCode,
        },
      });
      fetchComments();
    } catch (err) {
      alert('❌ 댓글 삭제 실패: 전용 코드가 잘못되었을 수 있습니다.');
    }
  };

  return (
    <div className="comment-section">
      <h4>💬 댓글 {comments.length}개</h4>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <strong>{comment.author}</strong>
            <span>{new Date(comment.created_at).toLocaleString()}</span>

            {editingId === comment.id ? (
              <div className="edit-area">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                ></textarea>
                <button onClick={() => handleSave(comment.id)}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}

            {/* 내가 쓴 댓글만 수정/삭제 버튼 표시 */}
            {nickname === comment.author && editingId !== comment.id && (
              <div className="comment-actions">
                <button onClick={() => handleEdit(comment)}>수정</button>
                <button onClick={() => handleDelete(comment.id)}>삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="comment-form">
        <input
          type="text"
          placeholder="닉네임 (수정/삭제 시 동일해야 함)"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <input
          type="password"
          placeholder="전용 코드 (수정/삭제용)"
          value={accessCode}
          onChange={handleAccessCodeChange}
        />
        <textarea
          placeholder="댓글을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>댓글 작성</button>
      </div>
    </div>
  );
}

export default CommentSection;
