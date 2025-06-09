export default class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.reader = null;
  }

  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          this.reader = new FileReader();

          this.reader.onload = () => {
            resolve({ default: this.reader.result }); // base64 형식으로 반환
          };

          this.reader.onerror = error => {
            reject(error);
          };

          this.reader.onabort = () => {
            reject('❌ 파일 업로드가 사용자의 요청으로 취소되었습니다.');
          };

          this.reader.readAsDataURL(file);
        })
    );
  }

  abort() {
    if (this.reader) {
      this.reader.abort(); // 강제 취소
    }
  }
}
