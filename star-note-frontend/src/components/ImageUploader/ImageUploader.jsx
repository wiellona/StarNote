import { useState } from 'react';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';
import { cloudName, uploadPreset } from '../../utils/cloudinary';
import './ImageUploader.css';

const ImageUploader = ({ currentCoverImage, onImageUpload, onImageRemove }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(currentCoverImage || null);
    const [uploadError, setUploadError] = useState(null);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            setUploadError('Please select an image file');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image must be less than 5MB');
            return;
        }

        setUploadError(null);
        setIsUploading(true);

        try {
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);      // Create form data for upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Pass the image URL to the parent component
            onImageUpload(data.secure_url);
            setIsUploading(false);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload image. Please try again.');
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        onImageRemove();
    };

    return (
        <div className="image-uploader">
            <h4>Note Cover</h4>

            {previewImage ? (
                <div className="image-preview-container">
                    <img
                        src={previewImage}
                        alt="Cover preview"
                        className="image-preview"
                    />
                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                        aria-label="Remove cover image"
                    >
                        <FiX />
                    </button>
                </div>
            ) : (
                <div className="upload-container">
                    <label className="upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden-input"
                        />
                        <div className="upload-placeholder">
                            <FiImage className="upload-icon" />
                            <span>Add cover image</span>
                        </div>
                    </label>
                </div>
            )}

            {isUploading && <div className="upload-status">Uploading...</div>}
            {uploadError && <div className="upload-error">{uploadError}</div>}
        </div>
    );
};

export default ImageUploader;
