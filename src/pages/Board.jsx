import { useEffect, useState } from 'react';
import axios from 'axios';
import './Board.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapterPlugin from './MyUploadAdapterPlugin'; // ✅ 이미지 업로드 어댑터 등록
import CommentSection from '../components/CommentSection';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Board() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [sortByLikes, setSortByLikes] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null); // ✅ 댓글 토글 상태
  const [currentUserAuthor, setCurrentUserAuthor] = useState(''); // ✅ 현재 사용자 저장 (author 기준)
  const [currentUserCode, setCurrentUserCode] = useState(''); // ✅ 현재 사용자 코드 저장
  const [likedPosts, setLikedPosts] = useState(new Set()); // ✅ 좋아요 누른 게시글 ID 집합
  const [dislikedPosts, setDislikedPosts] = useState(new Set()); // ✅ 싫어요 누른 게시글 ID 집합

  // ✅ 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/posts`);
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        console.error('❌ 서버에서 배열이 아닌 데이터 수신:', res.data);
        setPosts([]);
      }
    } catch (err) {
      console.error('❌ 게시글 불러오기 실패:', err.message);
      setPosts([]);
    }
  };

  // 최초 렌더링 시 localStorage에서 현재 사용자 정보 복원
  useEffect(() => {
    const savedAuthor = localStorage.getItem('currentUserAuthor') || '';
    const savedCode = localStorage.getItem('currentUserCode') || '';
    setCurrentUserAuthor(savedAuthor);
    setCurrentUserCode(savedCode);
    fetchPosts();
  }, []);

  // ✅ 게시글 작성 또는 수정
  const handleSubmit = async () => {
    if (!title || !content || !author || !code) {
      return alert('모든 필드를 입력해주세요.');
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/api/posts/${editingId}`, {
          title,
          content,
          author,
          access_code: code,
        });
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/api/posts`, {
          title,
          content,
          author,
          access_code: code,
        });
      }
      // 작성 완료 후 현재 사용자 정보 localStorage에 저장
      localStorage.setItem('currentUserAuthor', author);
      localStorage.setItem('currentUserCode', code);
      setCurrentUserAuthor(author);
      setCurrentUserCode(code);

      setTitle('');
      setContent('');
      setAuthor('');
      setCode('');
      fetchPosts();
    } catch (err) {
      alert('❌ 게시글 처리 중 오류가 발생했습니다.');
    }
  };

  // ✅ 게시글 수정 모드 진입
  const handleEdit = (post) => {
    const inputCode = prompt('수정하려면 요원 코드를 입력하세요.');
    if (inputCode === post.access_code) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
      setCode(inputCode);
      setEditingId(post.id);
      // 현재 사용자 정보도 업데이트 (선택 사항)
      localStorage.setItem('currentUserAuthor', post.author);
      localStorage.setItem('currentUserCode', inputCode);
      setCurrentUserAuthor(post.author);
      setCurrentUserCode(inputCode);
    } else {
      alert('❌ 코드가 일치하지 않습니다.');
    }
  };

  // ✅ 게시글 삭제
  const handleDelete = async (post) => {
    const inputCode = prompt('삭제하려면 요원 코드를 입력하세요.');
    if (inputCode !== post.access_code) return alert('❌ 코드가 일치하지 않습니다.');

    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API_BASE}/api/posts/${post.id}`, {
        data: { access_code: inputCode },
      });
      fetchPosts();
    } catch (err) {
      alert('❌ 삭제 실패');
    }
  };

  // ✅ 좋아요 토글 처리 (한번 누르면 좋아요, 다시 누르면 좋아요 취소)
  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const hasLiked = likedPosts.has(postId);
      const hasDisliked = dislikedPosts.has(postId);

      // 좋아요 취소
      if (hasLiked) {
        await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
          likes: post.likes - 1,
          dislikes: post.dislikes,
        });
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // 좋아요 누르기 전에 싫어요 눌렀으면 싫어요 취소
        if (hasDisliked) {
          await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
            likes: post.likes,
            dislikes: post.dislikes - 1,
          });
          setDislikedPosts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
        // 좋아요 +1
        await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
          likes: post.likes + 1,
          dislikes: post.dislikes,
        });
        setLikedPosts((prev) => new Set(prev).add(postId));
      }
      fetchPosts();
    } catch {
      alert('❌ 좋아요 처리 실패');
    }
  };

  // ✅ 싫어요 토글 처리 (한번 누르면 싫어요, 다시 누르면 취소)
  const handleDislike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const hasLiked = likedPosts.has(postId);
      const hasDisliked = dislikedPosts.has(postId);

      // 싫어요 취소
      if (hasDisliked) {
        await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
          likes: post.likes,
          dislikes: post.dislikes - 1,
        });
        setDislikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        // 싫어요 누르기 전에 좋아요 눌렀으면 좋아요 취소
        if (hasLiked) {
          await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
            likes: post.likes - 1,
            dislikes: post.dislikes,
          });
          setLikedPosts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
        // 싫어요 +1
        await axios.patch(`${API_BASE}/api/posts/${postId}/reactions`, {
          likes: post.likes,
          dislikes: post.dislikes + 1,
        });
        setDislikedPosts((prev) => new Set(prev).add(postId));
      }
      fetchPosts();
    } catch {
      alert('❌ 싫어요 처리 실패');
    }
  };

  // ✅ 정렬 방식 토글
  const toggleSortLikes = () => {
    if (sortByLikes === 'likes') setSortByLikes('dislikes');
    else if (sortByLikes === 'dislikes') setSortByLikes(null);
    else setSortByLikes('likes');
  };

  // ✅ 댓글 보기/숨기기 토글
  const toggleComments = (postId) => {
    setShowCommentsFor((prev) => (prev === postId ? null : postId));
  };

  // ✅ 검색 및 정렬 필터
  const filteredPosts = Array.isArray(posts)
    ? posts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchText.toLowerCase()) ||
            p.content.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => {
          if (sortByLikes === 'likes') return b.likes - a.likes;
          if (sortByLikes === 'dislikes') return b.dislikes - a.dislikes;
          return sortNewestFirst
            ? new Date(b.created_at) - new Date(a.created_at)
            : new Date(a.created_at) - new Date(b.created_at);
        })
    : [];

  return (
    <div className="board-page">
      <div className="board-container">
        <h2>Continental Board</h2>

        {/* 게시글 작성 폼 */}
        <div className="post-form">
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="board-title-input"
          />
          <CKEditor
            editor={ClassicEditor}
            config={{
              extraPlugins: [MyUploadAdapterPlugin], // 이미지 업로드 어댑터 등록
            }}
            data={content}
            onChange={(event, editor) => setContent(editor.getData())}
          />
          <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="board-title-input"
          />
          <input
            type="password"
            placeholder="continental 42 (더미 pw)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="board-title-input"
          />
          <button onClick={handleSubmit}>{editingId ? '수정 완료' : '작성 완료'}</button>
        </div>

        {/* 정렬 및 검색 */}
        <div className="board-controls">
          <input
            type="text"
            placeholder="게시글 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="board-title-input"
          />
          <div className="sort-buttons">
            <button onClick={() => setSortNewestFirst(!sortNewestFirst)}>
              {sortNewestFirst ? '최신순' : '과거순'}
            </button>
            <button onClick={toggleSortLikes}>
              {sortByLikes === 'likes'
                ? '좋아요순'
                : sortByLikes === 'dislikes'
                ? '싫어요순'
                : '기본정렬'}
            </button>
          </div>
        </div>

        <p className="post-count">총 게시글: {filteredPosts.length}개</p>

        {/* 게시글 목록 */}
        <div className="post-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="meta">
                작성자: {post.author} | 작성일:{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div className="post-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>

                {/* 반응 버튼 + 내가 쓴 글만 수정/삭제 버튼 렌더링 + 댓글 보기 버튼 */}
                <div className="reaction-buttons combined">
                  <button onClick={() => handleLike(post.id)} className={likedPosts.has(post.id) ? 'active-like' : ''}>
                    👍 {post.likes}
                  </button>
                  <button onClick={() => handleDislike(post.id)} className={dislikedPosts.has(post.id) ? 'active-dislike' : ''}>
                    👎 {post.dislikes}
                  </button>
                  {post.author === currentUserAuthor && (
                    <>
                      <button onClick={() => handleEdit(post)}>수정</button>
                      <button onClick={() => handleDelete(post)}>삭제</button>
                    </>
                  )}
                  <button onClick={() => toggleComments(post.id)}>
                    {showCommentsFor === post.id ? '댓글 숨기기' : '댓글 보기'}
                  </button>
                </div>

                {/* 댓글 표시 조건부 렌더링 */}
                {showCommentsFor === post.id && <CommentSection postId={post.id} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Board;
