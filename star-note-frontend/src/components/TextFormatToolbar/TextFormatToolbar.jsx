import React from 'react';
import { FiBold, FiItalic, FiList, FiImage } from 'react-icons/fi';
import { TbListNumbers } from 'react-icons/tb';
import './TextFormatToolbar.css';

const TextFormatToolbar = ({ 
  onFormat, 
  previewMode, 
  onTogglePreview, 
  content,
  cursorPosition,
  onImageInsert 
}) => {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onImageInsert(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="text-format-toolbar">
      <div className="toolbar-buttons">
        <button
          className={`format-btn ${previewMode ? 'disabled' : ''}`}
          onClick={() => onFormat('bold')}
          disabled={previewMode}
          title="Bold"
        >
          <FiBold />
        </button>
        <button
          className={`format-btn ${previewMode ? 'disabled' : ''}`}
          onClick={() => onFormat('italic')}
          disabled={previewMode}
          title="Italic"
        >
          <FiItalic />
        </button>
        <button
          className={`format-btn ${previewMode ? 'disabled' : ''}`}
          onClick={() => onFormat('bullet-list')}
          disabled={previewMode}
          title="Bullet List"
        >
          <FiList />
        </button>
        <button
          className={`format-btn ${previewMode ? 'disabled' : ''}`}
          onClick={() => onFormat('numbered-list')}
          disabled={previewMode}
          title="Numbered List"
        >
          <TbListNumbers />
        </button>
        <label 
          className={`format-btn image-upload ${previewMode ? 'disabled' : ''}`}
          title="Insert Image"
        >
          <FiImage />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={previewMode}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <button
        className="preview-btn"
        onClick={onTogglePreview}
        title={previewMode ? "Edit" : "Preview"}
      >
        {previewMode ? "Edit" : "Preview"}
      </button>
    </div>
  );
};

export default TextFormatToolbar;
