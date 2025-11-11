This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# 📝 Next.js Full-Stack Task Manager

A simple CRUD todo manager built with Next.js, TypeScript, and JSON-based storage.
Includes optional GraphQL integration - needs more work

## Features

- Create, read, update, and delete tasks
- API Routes and optional GraphQL API
- Client-side form validation and error handling

- Deployed version not able to write on Vercel so the next step is to change the database
- Vercel (and most serverless hosts) have a read-only filesystem at runtime, so changes to tasks.json won’t work after deployment

- example query:
  query {
  tasks {
  id
  title
  done
  }
  }

example query /api/graphql
