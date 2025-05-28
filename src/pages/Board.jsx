import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditorBase from '@ckeditor/ckeditor5-build-classic';
import './Board.css';

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        })
    );
  }
  abort() { }
}

function MyUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

class ClassicEditor extends ClassicEditorBase { }
ClassicEditor.builtinPlugins = [...ClassicEditorBase.builtinPlugins];
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'imageUpload', 'blockQuote', 'undo', 'redo'
    ]
  },
  image: {
    toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    styles: ['full', 'side']
  },
  language: 'ko'
};

const dummyPosts = [
  {
    id: 1,
    title: '첫 방문한 Continental의 추억',
    content: '<p style="color:white;">고요한 밤, 컨티넨탈 호텔의 입구는 찬란하게 빛난다.</p><img src="/hotel.png" />',
    author: 'John Wick',
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
    <p style="color:white;">
      매일 새벽, 이곳은 전장의 전초기지처럼 변한다. <br/>
      강철 같은 눈빛과 주먹, 그리고 흐르는 땀이 컨티넨탈의 룰을 지킨다.
    </p>
    <img src="/trainer.png" class="post-img" alt="trainer" />
  `,
    author: 'Winston',
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
    if (!title || !content || !author || code !== 'continental42') {
      return alert('제목, 본문, 작성자 이름을 입력하고 올바른 요원 코드(continental42)를 입력해야 합니다.');
    }

    if (editingId) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingId ? { ...post, title, content, author } : post
        )
      );
      setEditingId(null);
    } else {
      const newPost = {
        id: Date.now(),
        title,
        content,
        author,
        createdAt: new Date().toISOString().slice(0, 10),
        likes: 0,
        dislikes: 0,
        liked: false,
        disliked: false,
      };
      setPosts([newPost, ...posts]);
    }

    setTitle('');
    setContent('');
    setAuthor('');
    setCode('');
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
    setEditingId(post.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
            disliked: false,
            dislikes: post.disliked ? post.dislikes - 1 : post.dislikes,
          }
          : post
      )
    );
  };

  const handleDislike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
            ...post,
            dislikes: post.disliked ? post.dislikes - 1 : post.dislikes + 1,
            disliked: !post.disliked,
            liked: false,
            likes: post.liked ? post.likes - 1 : post.likes,
          }
          : post
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
      (post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(searchText.toLowerCase())
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
        <h2>콘티넨탈 게시판</h2>

        <div className="post-form">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="board-title-input"
          />
          <input
            type="text"
            placeholder="작성자 이름"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="board-title-input"
          />
          <input
            type="password"
            placeholder="요원 코드 입력 (예: continental42)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="board-title-input"
          />
          <div className="editor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              config={{ extraPlugins: [MyUploadAdapterPlugin], ...ClassicEditor.defaultConfig }}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>
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
            <button onClick={() => setSortNewestFirst((prev) => !prev)}>
              {sortNewestFirst ? '📅 최신순' : '📅 과거순'}
            </button>
            <button onClick={toggleSortLikes}>
              {sortByLikes === 'likes' ? '👍 좋아요순' : sortByLikes === 'dislikes' ? '👎 싫어요순' : '📊 기본정렬'}
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content.replace(/<img[^>]*>/g, '')
                  }}
                />
                {[...post.content.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)].map((match, i) => (
                  <div key={i} className="post-image-wrapper">
                    <img src={match[1]} alt={`uploaded-${i}`} />
                  </div>
                ))}

                {/* ✅ 버튼을 이미지 아래로 옮김 */}
                <div className="reaction-buttons combined">
                  <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
                  <button onClick={() => handleDislike(post.id)}>👎 {post.dislikes}</button>
                  <button onClick={() => handleEdit(post)}>✏️ 수정</button>
                  <button onClick={() => handleDelete(post.id)}>🗑 삭제</button>
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
