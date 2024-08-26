# Next Js Notes App

![alt text](https://github.com/mo-hassann/notes-app/blob/main/public/app-picture.png)


A feature-rich notes application built with Next.js, Hono, Clerk for authentication, React Query for data fetching, and Drizzle ORM for database management. This app allows users to create, edit, delete, and categorize notes easily.

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication**: Secure authentication using Clerk, allowing users to sign up, log in, and manage their accounts.
- **Create, Edit, and Delete Notes**: Users can easily create, edit, or delete their notes.
- **Categorize Notes**: Classify notes under different categories for better organization.
- **Real-time Data**: Data is fetched and updated in real-time using React Query, ensuring the UI is always in sync with the backend.
- **Responsive Design**: The application is fully responsive and works seamlessly on all devices.

## 🛠️ Tech Stack

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **Hono**: A lightweight web framework for building server-side applications with TypeScript.
- **Clerk**: Authentication service for managing user identities, including sign-up and login.
- **React Query**: A data-fetching library for managing server-state in React applications.
- **Drizzle ORM**: TypeScript-first ORM for type-safe database access.

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

- **Node.js** (v16.x or higher) and **npm** or **yarn**.
- **Bun**: If you prefer using Bun for package management and running scripts.
- **PostgreSQL** (or another supported SQL database).

### 🚀 Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mo-hassann/nextjs-notes-app.git
    cd nextjs-notes-app
    ```

2. **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Using yarn:

    ```bash
    yarn install
    ```

    Using Bun:

    ```bash
    bun install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # next
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    # cleark auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=************
    CLERK_SECRET_KEY=***********

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    #hono with clerk
    CLERK_PUBLISHABLE_KEY=**************

    # database
    DATABASE_URL=https://**************
    DATABASE_SECRET=************************
    DRIZZLE_DATABASE_URL=postgresql://*******:*********************
    ```

4. **Run database migrations:**

    Ensure your database is running and then run:

    Using npm or yarn:

    ```bash
    npm run migrate
    # or
    yarn migrate
    ```

    Using Bun:

    ```bash
    bun run migrate
    ```

5. **Start the development server:**

    Using npm or yarn:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Using Bun:

    ```bash
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📖 Usage

### Running the app

- **Development mode:** `npm run dev`, `yarn dev`, or `bun dev`.
- **Production mode:** `npm run build && npm start`, `yarn build && yarn start`, or `bun run build && bun start`.

### API Documentation

The API documentation for this application is available at [http://localhost:3000/api/docs](http://localhost:3000/api/docs). It details all endpoints and their usage.

## 🤝 Contributing

We welcome contributions to this project. Please follow these steps to contribute:

1. **Fork the repository.**
2. **Create a new branch** (`git checkout -b feature/your-feature-name`).
3. **Make your changes** and commit them (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a pull request**.

Please make sure to update tests as appropriate.

## 📜 License

Distributed under the MIT License. See [License](/LICENSE) for more information.
