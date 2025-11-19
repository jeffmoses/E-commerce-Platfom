# MERN Stack Capstone Project

This assignment focuses on designing, developing, and deploying a comprehensive full-stack MERN application that showcases all the skills you've learned throughout the course.

## Assignment Overview

You will:
1. Plan and design a full-stack MERN application
2. Develop a robust backend with MongoDB, Express.js, and Node.js
3. Create an interactive frontend with React.js
4. Implement testing across the entire application
5. Deploy the application to production

## Getting Started

1. Accept the GitHub Classroom assignment
2. Clone the repository to your local machine
3. Follow the instructions in the `Week8-Assignment.md` file
4. Plan, develop, and deploy your capstone project

## Project Overview

This repository contains a MERN (MongoDB, Express, React, Node) e-commerce platform prototype with:
- A RESTful API (Express + Mongoose)
- User authentication (JWT)
- Cart and order management
- Socket.IO for real-time notifications
- React frontend with Redux state management and Tailwind CSS

This README provides quick setup, development, testing, and deployment instructions.

## Files Included

- `Week8-Assignment.md`: Detailed assignment instructions

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git and GitHub account
- Accounts on deployment platforms (Render/Vercel/Netlify/etc.)

## Local setup (quick)

1. Install dependencies for server and client:

```bash
# from repo root
cd server && npm install
cd ../client && npm install
```

2. Configure environment variables:

- Copy `server/.env` and update values (MongoDB URI, JWT secret, etc.).
- Optionally set `client/.env.local` (`REACT_APP_API_URL`, `REACT_APP_SOCKET_URL`).

3. Run servers:

```bash
# Start server
cd server
npm start

# Start client (in a separate terminal)
cd client
npm start
```

4. Run client tests:

```bash
cd client
npm test
```

## Useful scripts

- `server`: run server (`cd server && npm start`)
- `client`: run React dev server (`cd client && npm start`)
- `client:test`: run frontend unit tests (`cd client && npm test`)

## Contributing

If you contribute, please:
- Add tests for new functionality
- Update documentation in `docs/`
- Open a pull request describing your changes

## Where to find documentation

- API reference: `docs/API.md`
- User guide: `docs/USER_GUIDE.md`
- Architecture notes: `docs/ARCHITECTURE.md`
- Presentation outline: `docs/PRESENTATION.md`

## Project Ideas

The `Week8-Assignment.md` file includes several project ideas, but you're encouraged to develop your own idea that demonstrates your skills and interests.

## Submission

Your project will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Commit and push your code regularly
2. Include comprehensive documentation
3. Deploy your application and add the live URL to your README.md
4. Create a video demonstration and include the link in your README.md

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [GitHub Classroom Guide](https://docs.github.com/en/education/manage-coursework-with-github-classroom) 