Project Master Plan: The Bond Archive (Ultra-Luxury Personal Vault & Journal)

Role: You are an elite Digital Architect specializing in ultra-luxury digital experiences (like the official sites for Aston Martin, Tom Ford, or Rolex). You are building a deeply personal, highly exclusive digital vault and journal.

Thematic & Aesthetic Directives (CRUCIAL: "Restrained Sexiness" & "Old Money"):

The Vibe: The application MUST exude the tailored elegance of James Bond. It is NOT a hacker terminal or a tactical military UI. It is a quiet, highly exclusive private club. Think "Old money elegance", "Minimalist luxury", and "Restrained sexiness".

Terminology (Exclusive & Curated): >    - "Blog/Posts" -> "The Archives" or "Private Journal".

"File Upload" -> "Secure Depository" or "Asset Vault".

"Categories" -> "Collections" or "Access Tiers".

Visual Language: >    - Colors: Deep obsidian, midnight navy, and charcoal. Accents must be extremely subtle Champagne Gold (#D4AF37) or Brushed Platinum. Absolutely NO neon, no pure white, no hacker green.

Typography: Playfair Display (italicized heavily for elegant accents/numbers) paired with highly-tracked (wide letter-spacing) Inter for metadata.

Animations: DO NOT use bouncy or glitchy effects. Use Framer Motion for incredibly slow, heavy, and deliberate easing curves. Elements should fade and slide in with the smooth resistance of a luxury car door closing or a heavy safe unlocking.

UI Foundation (Image-Centric Deep Glassmorphism):
The background is a fixed, high-res cinematic image (/public/images/v12-hero.jpg - e.g., a dark, moody shot of an Aston Martin). UI components (nav, cards, depository zone) float over this using extreme backdrop-blur-2xl, bg-[#050505]/30, and ultra-thin border-white/5.

Core Tech Stack & Architecture:

Framework: Next.js 14 (App Router) + TypeScript.

The Archives (MDX Journal): Use next-mdx-remote or Contentlayer to render local .mdx files.

Database (Private Ledger): Use Prisma with PostgreSQL. Models: JournalEntry (for view counts) and VaultAsset (for uploaded documents).

Secure Depository: Use Vercel Blob via Next.js Server Actions for secure, drag-and-drop file uploads (PPTs, PDFs).

Execution Phases (Strictly step-by-step. Await my confirmation after each phase):

Phase 1: The Foundation (Layout & Cinematic Dashboard)

Setup Next.js, Tailwind, and global fonts (Playfair & Inter).

Build the global layout.tsx with the fixed Aston Martin HD background and a hyper-minimalist glass navigation bar.

Build page.tsx. Include a Parallax Hero section with massive elegant typography, generous negative space, and deeply blurred 3D-tilt glass cards (very subtle tilt, like handling a heavy invitation card).

Phase 2: The Archives (The MDX Engine)

Create MDX processing utilities for /content/archives/.

Build the listing page using elegant, editorial-style typography.

Build the dynamic route /archives/[slug]/page.tsx. The prose must look like a high-end magazine layout.

Phase 3: The Vault (Vercel Blob + Prisma)

Setup Prisma schema for VaultAsset.

Build the "Secure Depository" dropzone. It should feel like a velvet-lined tray, not a standard web form. Use subtle gold border highlights on drag-over.

Implement Server Actions to upload to Vercel Blob and save to Postgres.

Your Immediate Task: Acknowledge this Master Plan. Then, execute Phase 1 ONLY. Write the layout, cinematic dashboard, and styles. Focus obsessively on the "Restrained Sexiness" aesthetic. Await my review.