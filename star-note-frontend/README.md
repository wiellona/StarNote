# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# StarNote Frontend

This is the frontend for the StarNote application, a note-taking app with Markdown support and image uploads.

## Features

- Create, edit, and organize notes
- Format notes with Markdown syntax
- Add cover images to notes using Cloudinary
- Categorize and favorite notes
- Search and filter notes

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Cloudinary credentials:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=star_note_covers
   ```
4. Run the development server with `npm run dev`

## Cloudinary Setup

To enable image uploads for note covers:

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. In your Cloudinary dashboard, go to Settings > Upload
3. Create a new upload preset named `star_note_covers` 
4. Set the preset mode to "Unsigned"
5. Add your Cloudinary cloud name to the `.env` file as shown above
6. (Optional) Configure additional options like image transformations, folder paths, etc.

## Development

This project uses:
- React with Vite
- React Router for navigation
- Cloudinary for image uploads and storage
- CSS variables for theming

---
