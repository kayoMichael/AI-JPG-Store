# Generative AI Market Place
A Full Stack MERN Stack App allowing users to View and Share their own AI Generated Image.

## Tech Stack
<div align="left">
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png" alt="React" title="React"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" alt="TypeScript" title="TypeScript"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png" alt="Node.js" title="Node.js"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/express.png" alt="Express" title="Express"/>
        <img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" alt="mongoDB" title="mongoDB"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/redis.png" alt="redis" title="redis"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/tailwind_css.png" alt="Tailwind CSS" title="Tailwind CSS"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/shadcn_ui.png" alt="ShadCn UI" title="Shadcn UI"/>
</div>

## Deployments
<div align="left">
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/github.png" alt="GitHub" title="GitHub Action"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/docker.png" alt="Docker" title="Docker"/>
	<img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/gcp.png" alt="GCP" title="GCP"/>
</div>

## Running Local Server
```
git clone https://github.com/kayoMichael/AI-JPG-Store.git
cd AI-JPG-Store
make dev
```

## File Structure
```
.
├── README.md
├── client
│   ├── README.md
│   ├── components.json
│   ├── dist
│   │   ├── assets
│   │   │   ├── index-CEkiWjTn.css
│   │   │   └── index-D2SywUXl.js
│   │   ├── index.html
│   │   └── vite.svg
│   ├── dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── category
│   │   │   ├── cyberpunk.jpg
│   │   │   ├── photography.jpg
│   │   │   └── space.jpg
│   │   ├── cover
│   │   │   ├── anime.jpg
│   │   │   ├── baroque.png
│   │   │   ├── contemporary.webp
│   │   │   ├── cyberpunk.png
│   │   │   ├── impressionism.jpg
│   │   │   ├── photography.webp
│   │   │   ├── renaissance.jpg
│   │   │   └── space.png
│   │   ├── default.webp
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── Layout.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Image.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── NavButton.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   ├── container
│   │   │   │   └── Container.tsx
│   │   │   ├── layout
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   ├── DynamicCover.tsx
│   │   │   │   ├── FeatureButton.tsx
│   │   │   │   ├── InputField.tsx
│   │   │   │   ├── Markdown.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── PaginatedContent.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   └── SettingsLayout.tsx
│   │   │   ├── skeleton
│   │   │   │   ├── AllImageSkeleton.tsx
│   │   │   │   ├── DashboardSkeleton.tsx
│   │   │   │   ├── DetailSkeleton.tsx
│   │   │   │   └── NavbarSkeleton.tsx
│   │   │   └── ui
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── carousel.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── focusCards.tsx
│   │   │       ├── form.tsx
│   │   │       ├── heroCard.tsx
│   │   │       ├── horizontalCarousel.tsx
│   │   │       ├── image-carousel.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── toast.tsx
│   │   │       ├── toaster.tsx
│   │   │       └── tooltip.tsx
│   │   ├── config
│   │   │   └── env.ts
│   │   ├── constant
│   │   │   ├── AiModels.tsx
│   │   │   └── Logo.tsx
│   │   ├── context
│   │   │   ├── AuthContext.ts
│   │   │   ├── CarouselContext.ts
│   │   │   └── CategoryContext.ts
│   │   ├── hooks
│   │   │   ├── use-outside-click.ts
│   │   │   ├── use-pagination.ts
│   │   │   ├── use-toast.ts
│   │   │   └── use-validate.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── account
│   │   │   │   ├── Account.tsx
│   │   │   │   ├── AppearenceAccount.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── ProfileAccount.tsx
│   │   │   │   └── SecurityAccount.tsx
│   │   │   ├── all-images
│   │   │   │   └── AllImages.tsx
│   │   │   ├── auth
│   │   │   │   ├── AccountCreated.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signout.tsx
│   │   │   │   └── Signup.tsx
│   │   │   ├── categories
│   │   │   │   ├── Categories.tsx
│   │   │   │   └── ImageCarousel.tsx
│   │   │   ├── collection
│   │   │   │   └── PersonalImage.tsx
│   │   │   ├── create
│   │   │   │   ├── CreateImage.tsx
│   │   │   │   ├── GenerateImage.tsx
│   │   │   │   └── ImageForm.tsx
│   │   │   ├── detail
│   │   │   │   ├── DetailEdit.tsx
│   │   │   │   ├── DetailView.tsx
│   │   │   │   └── ImageDetail.tsx
│   │   │   ├── error
│   │   │   │   └── Error.tsx
│   │   │   ├── image
│   │   │   │   └── Images.tsx
│   │   │   └── main
│   │   │       ├── CarouselCards.tsx
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ImageCard.tsx
│   │   │       └── ProductCard.tsx
│   │   ├── types
│   │   │   ├── image.ts
│   │   │   └── user.ts
│   │   ├── utils
│   │   │   ├── capitalise.ts
│   │   │   └── merge.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.app.tsbuildinfo
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tsconfig.node.tsbuildinfo
│   └── vite.config.ts
├── docker-compose.yaml
├── makefile
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── server
    ├── dist
    │   ├── config
    │   ├── models
    │   └── utils
    ├── dockerfile
    ├── package.json
    ├── src
    │   ├── config
    │   │   ├── cors.ts
    │   │   ├── database.ts
    │   │   ├── env.ts
    │   │   ├── redis.ts
    │   │   └── storage.ts
    │   ├── controllers
    │   │   ├── auth.controllers.ts
    │   │   ├── image.controllers.ts
    │   │   ├── like.controllers.ts
    │   │   └── user.controllers.ts
    │   ├── index.ts
    │   ├── middleware
    │   │   ├── auth.ts
    │   │   ├── error.middleware.ts
    │   │   └── session.middleware.ts
    │   ├── models
    │   │   ├── Image.ts
    │   │   ├── Likes.ts
    │   │   └── User.ts
    │   ├── routes
    │   │   ├── auth.routes.ts
    │   │   ├── image.routes.ts
    │   │   ├── like.routes.ts
    │   │   └── user.routes.ts
    │   ├── types
    │   │   └── session.d.ts
    │   └── utils
    │       ├── enum.ts
    │       └── password.ts
    └── tsconfig.json

45 directories, 156 files
```
