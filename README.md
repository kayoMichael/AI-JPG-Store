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

### Prerequisites
- Docker and Docker Compose installed on your system
- Git installed on your system

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/kayoMichael/AI-JPG-Store.git
   cd AI-JPG-Store
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required variables

3. Start up a Docker Daemon

4. Start the development server:
   ```bash
   make dev
   ```

## Build
```
make build
```

## Deploy
The application is deployed via Github actions.

After cloning the web, create a new Repo from the cloned code.

Add the following Secrets and variables to the Repo

## Secrets
1. GCP_SA_KEY - Google Cloud Platform Service Account key in JSON format
2. MONGO_DB_CONNECTION_KEY - MongoDB connection string
3. REDIS_HOST - Redis host address
4. REDIS_PASSWORD - Redis password
5. SESSION_SECRET_KEY - Secret key for session management
6. GCS_SERVICE_ACCOUNT - Google Cloud Storage service account credentials
7. GCS_BUCKET_NAME - Google Cloud Storage bucket name
8. OPENAI_API_KEY - OpenAI API key

## Variables

1. NODE_ENV - Node.js environment
2. REDIS_PORT - Redis port number
3. REDIS_USERNAME - Redis username

## Hardcoded configs in the workflow file

1. PROJECT_ID - Google Cloud Project ID (currently "mern-stack-app-447200")
2. REGION - Google Cloud region (currently "northamerica-northeast2")
3. CLIENT_IMAGE - Client Docker image repository path
4. SERVER_IMAGE - Server Docker image repository path
5. PROD_CLIENT_URL - Production client URL
6. PROD_SERVER_URL - Production server URL

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
