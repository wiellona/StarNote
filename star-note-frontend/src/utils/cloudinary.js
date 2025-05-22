// Configure Cloudinary client
import { Cloudinary } from '@cloudinary/url-gen';

// Get cloud name from environment variables
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'star_note_covers';

// Create a Cloudinary instance
const cld = new Cloudinary({
    cloud: {
        cloudName
    },
    url: {
        secure: true // Use HTTPS
    }
});

export { cld, cloudName, uploadPreset };
export default cld;
