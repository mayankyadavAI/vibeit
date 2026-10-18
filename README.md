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

[![VibeIt — AI Virtual Try-On Studio Walkthrough](https://img.youtube.com/vi/OpQyLKC3dw8/maxresdefault.jpg)](https://www.youtube.com/watch?v=OpQyLKC3dw8)

> 📹 **[Watch the full demo walkthrough on YouTube](https://www.youtube.com/watch?v=OpQyLKC3dw8)**

---

## 📸 Visual Showcase

<div align="center">
  <img src="https://github.com/user-attachments/assets/605cf2a0-9420-4391-9812-30dcbc7b33d5" alt="VibeIt Atelier Landing Page" width="100%" />
  <p><em>Haute Couture Atelier digital showroom and virtual try-on portal</em></p>
</div>

### Studio & Generation Suite

| Studio Workspace & Asset Staging | Interactive Before / After Split Slider |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/b1a76059-bc0d-4d91-bb0f-7c10824b8a2c" alt="Studio Workspace" width="100%" /> | <img src="https://github.com/user-attachments/assets/aa7e503d-3cbc-4dfe-a87e-e9ce912f1293" alt="Before After Slider" width="100%" /> |
| *High-fidelity dual-asset upload zone (Portrait + Garment)* | *Pixel-accurate interactive comparison slider* |

| Garment & Category Selection | History & Creations Vault |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/7181e36e-0ef9-4312-8a20-0bde1748b616" alt="Garment Selection" width="100%" /> | <img src="https://github.com/user-attachments/assets/e3d9723f-4c0b-4e52-82d7-cd255f9f5850" alt="History Vault" width="100%" /> |
| *Upper body, lower body, and full-length dresses selection* | *Persistent cloud storage vault of past synthesized looks* |

---

## ✨ Features

- **⚡ Photorealistic Virtual Try-On:** Powered by the YouCam / Perfect Corp AI Clothes Virtual Try-On v4 engine. Seamlessly drapes garments onto user photos while preserving posture, lighting, and natural fabric folds.
- **🔄 Interactive Before/After Slider:** Compare original photo against try-on output with a smooth split-pane draggable slider.
- **📸 Camera & File Upload:** Upload existing model photos or capture directly using your webcam.
- **🏷️ Multi-Category Garment Support:** Easily switch between upper body, lower body, and full-length dresses, or pick from curated benchmark trial samples.
- **💾 Cloud History & Vault:** Save, browse, and download previous try-on creations powered by InsForge backend storage & PostgreSQL database.
- **🔐 Enterprise Authentication:** Industry-standard sign-up and sign-in flow with mandatory 6-digit Email OTP verification, live password confirmation, and password reset powered by InsForge Auth.
- **🎨 Haute Couture Atelier Aesthetic:** Premium Parisian fashion house design language featuring warm Alabaster Stone, Obsidian Velvet, Silk Champagne Gold, and editorial typography.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Try-On Engine:** [YouCam / Perfect Corp API](https://yce-api-01.makeupar.com) (Cloth v4 Neural Task Pipeline)
- **Backend & Database:** [InsForge BaaS](https://insforge.dev/) (PostgreSQL + PostgREST)
- **Authentication:** InsForge Auth (Email OTP Verification / Session Management)
- **Storage:** InsForge Storage (`tryon-assets` bucket)
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
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_INSFORGE_URL=https://your-app.region.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-insforge-anon-key
PERFECT_CORP_YOUCAM_API_KEY=your-youcam-api-key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
