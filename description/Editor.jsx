import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// ✅ 이미지 리사이징 함수
function resizeImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, 0.9);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ✅ 커스텀 업로드 어댑터
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const resized = await resizeImage(file);

    const formData = new FormData();
    formData.append('upload', resized, file.name);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return { default: result.url }; // 서버에서 반환된 URL 사용
  }

  abort() {}
}

// ✅ CKEditor에 플러그인 등록 함수
function MyUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

function Editor({ onChange }) {
  const [data, setData] = useState('');

  return (
    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          extraPlugins: [MyUploadAdapterPlugin],
        }}
        data={data}
        onChange={(event, editor) => {
          const newData = editor.getData();
          setData(newData);
          if (onChange) onChange(newData);
        }}
      />
    </div>
  );
}

export default Editor;
