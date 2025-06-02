import { useState } from 'react';
import './Board.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapterPlugin from './MyUploadAdapterPlugin';

const dummyPosts = [
  {
    id: 1,
    title: '첫 방문한 Continental의 추억',
    content: `
      고요한 밤, 컨티넨탈 호텔의 입구는 찬란하게 빛난다.
      <figure class="image">
        <img src="/hotel.png" alt="호텔 입구" />
      </figure>
    `,
    author: 'John Wick',
    secretCode: 'continental42',
    createdAt: '2025-05-28',
    likes: 3,
    dislikes: 0,
    liked: false,
    disliked: false,
  },
  {
    id: 2,
    title: '살아남기 위한 훈련의 기록',
    content: `
      매일 새벽, 이곳은 전장의 전초기지처럼 변한다. 강철 같은 눈빛과 주먹, 그리고 흐르는 땀이 컨티넨탈의 룰을 지킨다.
      <figure class="image">
        <img src="/trainer.png" alt="트레이닝 센터" />
      </figure>
    `,
    author: 'Winston',
    secretCode: 'continental42',
    createdAt: '2025-05-28',
    likes: 5,
    dislikes: 1,
    liked: false,
    disliked: false,
  },
];

function Board() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [code, setCode] = useState('');
  const [posts, setPosts] = useState(dummyPosts);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [sortByLikes, setSortByLikes] = useState(null);

  const handleSubmit = () => {
    if (!title || !content || !author || !code) {
      return alert('제목, 본문, 작성자, 요원 코드를 모두 입력해주세요.');
    }

    const newPost = {
      id: editingId || Date.now(),
      title,
      content,
      author,
      secretCode: code,
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
    };

    if (editingId) {
      setPosts((prev) => prev.map((p) => (p.id === editingId ? newPost : p)));
      setEditingId(null);
    } else {
      setPosts([newPost, ...posts]);
    }

    setTitle('');
    setContent('');
    setAuthor('');
    setCode('');
  };

  const handleEdit = (post) => {
    const inputCode = prompt('수정하려면 해당 게시글의 요원 코드를 입력하세요');
    if (inputCode === post.secretCode) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
      setCode(inputCode);
      setEditingId(post.id);
    } else {
      alert('코드가 일치하지 않습니다.');
    }
  };

  const handleDelete = (post) => {
    const inputCode = prompt('삭제하려면 해당 게시글의 요원 코드를 입력하세요');
    if (inputCode === post.secretCode) {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        setPosts(posts.filter((p) => p.id !== post.id));
      }
    } else {
      alert('코드가 일치하지 않습니다.');
    }
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
              liked: !p.liked,
              disliked: false,
              dislikes: p.disliked ? p.dislikes - 1 : p.dislikes,
            }
          : p
      )
    );
  };

  const handleDislike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              dislikes: p.disliked ? p.dislikes - 1 : p.dislikes + 1,
              disliked: !p.disliked,
              liked: false,
              likes: p.liked ? p.likes - 1 : p.likes,
            }
          : p
      )
    );
  };

  const toggleSortLikes = () => {
    if (sortByLikes === 'likes') setSortByLikes('dislikes');
    else if (sortByLikes === 'dislikes') setSortByLikes(null);
    else setSortByLikes('likes');
  };

  const filteredPosts = posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.content.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortByLikes === 'likes') return b.likes - a.likes;
      if (sortByLikes === 'dislikes') return b.dislikes - a.dislikes;
      return sortNewestFirst
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="board-page">
      <div className="board-container">
        <h2>Continental Board</h2>

        <div className="post-form">
          <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} className="board-title-input" />

          <CKEditor
            editor={ClassicEditor}
            config={{ extraPlugins: [MyUploadAdapterPlugin] }}
            data={content}
            onChange={(event, editor) => setContent(editor.getData())}
          />

          <input type="text" placeholder="작성자" value={author} onChange={(e) => setAuthor(e.target.value)} className="board-title-input" />
          <input type="password" placeholder="요원 코드 (continental42)" value={code} onChange={(e) => setCode(e.target.value)} className="board-title-input" />
          <button onClick={handleSubmit}>{editingId ? '수정 완료' : '작성 완료'}</button>
        </div>

        <div className="board-controls">
          <input type="text" placeholder="게시글 검색" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="board-title-input" />
          <div className="sort-buttons">
            <button onClick={() => setSortNewestFirst((prev) => !prev)}>{sortNewestFirst ? '최신순' : '과거순'}</button>
            <button onClick={toggleSortLikes}>
              {sortByLikes === 'likes' ? '좋아요순' : sortByLikes === 'dislikes' ? '싫어요순' : '기본정렬'}
            </button>
          </div>
        </div>

        <p className="post-count">총 게시글: {filteredPosts.length}개</p>

        <div className="post-list">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p className="meta">작성자: {post.author} | 작성일: {post.createdAt}</p>
              <div className="post-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <div className="reaction-buttons combined">
                  <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
                  <button onClick={() => handleDislike(post.id)}>👎 {post.dislikes}</button>
                  <button onClick={() => handleEdit(post)}> 수정</button>
                  <button onClick={() => handleDelete(post)}> 삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Board;
