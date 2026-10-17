# 👗 VibeIt — AI Virtual Try-On Studio

> Transform your fashion shopping experience with instant, photorealistic AI virtual try-on. Upload your photo, pick any garment, and see how it fits you in seconds.

[![Live Demo](https://img.shields.io/badge/Live_Demo-856kht2i.insforge.site-teal?style=for-the-badge&logo=vercel)](https://856kht2i.insforge.site)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![InsForge](https://img.shields.io/badge/Backend-InsForge-00C7B7?style=for-the-badge)](https://insforge.dev/)

---

## 🌐 Live Application
- **Live URL:** [https://856kht2i.insforge.site](https://856kht2i.insforge.site)

---

## 🎥 Demo Video

<!-- Replace the link/thumbnail below with your Loom, YouTube, or MP4 video URL -->
[![VibeIt Video Walkthrough](https://placehold.co/1200x675/090d16/2dd4bf?text=▶+Click+to+Watch+VibeIt+Demo+Video)](https://856kht2i.insforge.site)

> 💡 **Demo Video Placeholder:** Replace the above image link with your recorded video walkthrough (Loom, YouTube, or direct MP4 link).

---

## 📸 Screenshots

<!-- Replace these placeholder images with your actual screenshots in /public or hosted URLs -->

| Studio Workspace & Try-On | Interactive Before/After Slider |
| :---: | :---: |
| ![Studio Workspace](https://placehold.co/600x380/090d16/2dd4bf?text=Studio+Workspace+Screenshot) | ![Before After Slider](https://placehold.co/600x380/090d16/2dd4bf?text=Before+%26+After+Slider+Screenshot) |
| *Intuitive studio for uploading model photo & garment* | *Interactive split-view comparison slider* |

| Garment & Category Selection | History & Creations Vault |
| :---: | :---: |
| ![Garment Selection](https://placehold.co/600x380/090d16/2dd4bf?text=Garment+Categories+Screenshot) | ![History Vault](https://placehold.co/600x380/090d16/2dd4bf?text=Creations+History+Screenshot) |
| *Tops, bottoms, dresses & preloaded sample garments* | *Persistent cloud history of past try-on generations* |

---

## ✨ Features

- **⚡ Photorealistic Virtual Try-On:** Seamlessly blends target clothing onto user photos while preserving posture, lighting, and natural fabric folds.
- **🔄 Interactive Before/After Slider:** Compare original photo against try-on output with a smooth split-pane draggable slider.
- **📸 Camera & File Upload:** Upload existing model photos or capture directly using your webcam.
- **🏷️ Multi-Category Garment Support:** Easily switch between tops, bottoms, and full-body outfits, or pick from curated sample garments.
- **💾 Cloud History & Vault:** Save, browse, and download previous try-on creations powered by InsForge backend storage & PostgreSQL database.
- **🔐 Secure Authentication:** Seamless email passwordless/OTP authentication flow powered by InsForge Auth.
- **🎨 Modern Dark Aesthetic:** Sleek glassmorphic interface with micro-interactions and responsive design.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend & Database:** [InsForge BaaS](https://insforge.dev/) (PostgreSQL + PostgREST)
- **Authentication:** InsForge Auth (Email OTP / Session Management)
- **Storage:** InsForge Storage for model and generation images
- **Deployment:** InsForge Hosting

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mayankyadavAI/vibeit.git
cd vibeit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your InsForge credentials:
```env
NEXT_PUBLIC_INSFORGE_URL=https://your-app.region.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-insforge-anon-key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
