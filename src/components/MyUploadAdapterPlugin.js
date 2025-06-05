// src/components/MyUploadAdapterPlugin.js

// ✅ 이미지 리사이즈 함수 (너비 800px 기준)
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
        }, file.type, 0.9); // 90% 품질 유지
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ✅ 업로드 어댑터 클래스
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const resized = await resizeImage(file); //  리사이즈 처리

    const formData = new FormData();
    formData.append('upload', resized, file.name); // 서버에서 upload로 받도록 일치시킴

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return { default: result.url }; // 에디터에서 사용할 이미지 URL 반환
  }

  abort() {}
}

// ✅ CKEditor에 플러그인 등록
export default function MyUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
