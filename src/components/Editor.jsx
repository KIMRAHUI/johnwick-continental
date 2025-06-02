// components/Editor.jsx
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Editor({ onChange }) {
  const [data, setData] = useState('');

  return (
    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
      <CKEditor
        editor={ClassicEditor}
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
