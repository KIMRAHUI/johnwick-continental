import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Board.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapterPlugin from './MyUploadAdapterPlugin';
import CommentSection from '../components/CommentSection';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Board() {
  const editorRef = useRef(null); // ✅ 상단 에디터 영역 참조

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [sortByLikes, setSortByLikes] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [currentUserAuthor, setCurrentUserAuthor] = useState('');
  const [currentUserCode, setCurrentUserCode] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dislikedPosts, setDislikedPosts] = useState(new Set());

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

  useEffect(() => {
    const savedAuthor = localStorage.getItem('currentUserAuthor') || '';
    const savedCode = localStorage.getItem('currentUserCode') || '';
    setCurrentUserAuthor(savedAuthor);
    setCurrentUserCode(savedCode);
    fetchPosts();
  }, []);

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

  const handleEdit = (post) => {
    const inputCode = prompt('수정하려면 요원 코드를 입력하세요.');
    if (inputCode === post.access_code) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
      setCode(inputCode);
      setEditingId(post.id);
      localStorage.setItem('currentUserAuthor', post.author);
      localStorage.setItem('currentUserCode', inputCode);
      setCurrentUserAuthor(post.author);
      setCurrentUserCode(inputCode);

      // ✅ 에디터로 스크롤 이동
      setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      alert('❌ 코드가 일치하지 않습니다.');
    }
  };

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

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const hasLiked = likedPosts.has(postId);
      const hasDisliked = dislikedPosts.has(postId);

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

  const handleDislike = async (postId) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const hasLiked = likedPosts.has(postId);
      const hasDisliked = dislikedPosts.has(postId);

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

  const toggleSortLikes = () => {
    if (sortByLikes === 'likes') setSortByLikes('dislikes');
    else if (sortByLikes === 'dislikes') setSortByLikes(null);
    else setSortByLikes('likes');
  };

  const toggleComments = (postId) => {
    setShowCommentsFor((prev) => (prev === postId ? null : postId));
  };

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

        {/* ✅ 상단 에디터 ref 연결 */}
        <div className="post-form" ref={editorRef}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="board-title-input"
          />
          <CKEditor
            editor={ClassicEditor}
            config={{ extraPlugins: [MyUploadAdapterPlugin] }}
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

        <div className="post-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="meta">
                작성자: {post.author} | 작성일: {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div className="post-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <div className="reaction-buttons combined">
                  <button onClick={() => handleLike(post.id)} className={likedPosts.has(post.id) ? 'active-like' : ''}>
                    👍 {post.likes}
                  </button>
                  <button
                    onClick={() => handleDislike(post.id)}
                    className={dislikedPosts.has(post.id) ? 'active-dislike' : ''}
                  >
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
