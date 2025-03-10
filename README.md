# User Portal Portfolio Project

A portfolio project showcasing a user portal with login features and user management using DummyJSON API.

## Features

- **Authentication**: Login functionality using DummyJSON Auth API
- **Dashboard**: User profile information and quick links
- **User Management**: Table view of users with search and pagination
- **Responsive Design**: Works on mobile and desktop

## Technologies Used

- **Next.js**: React framework for building the application
- **TypeScript**: For type safety and better developer experience
- **Material UI**: Component library for modern UI design
- **Axios**: For API requests
- **DummyJSON**: For mock API data

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd user-portal
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login

Use the following credentials to log in:

- Username: `kminchelle`
- Password: `0lelplR`

### Dashboard

After logging in, you'll be redirected to the dashboard where you can see:

- Your profile information
- Quick links to other sections

### User Management

Navigate to the Users section to view all users in a table format:

- Search for users by name, email, or username
- Paginate through the user list
- View user details

## API Integration

This project uses the following DummyJSON API endpoints:

- **Authentication**: `https://dummyjson.com/auth/login`
- **Users**: `https://dummyjson.com/users`
- **User Search**: `https://dummyjson.com/users/search`

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── dashboard/        # Dashboard pages
│   │   ├── users/        # User management
│   │   └── layout.tsx    # Dashboard layout with navigation
│   ├── login/            # Login page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to login)
├── context/              # React context
│   └── AuthContext.tsx   # Authentication context
├── services/             # API services
│   └── api.ts            # API client and services
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [DummyJSON](https://dummyjson.com/) for providing the mock API
- [Next.js](https://nextjs.org/) for the React framework
- [Material UI](https://mui.com/) for the component library
