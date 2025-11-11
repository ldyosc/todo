import { Task } from '@/types/task';
import fs from 'fs';
import { createSchema, createYoga } from 'graphql-yoga';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

function readTasks(): Task[] {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
function writeTasks(tasks: Task[]) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
      type Task {
        id: ID!
        title: String!
        done: Boolean!
      }

      type Query {
        tasks: [Task!]!
      }

      type Mutation {
        addTask(title: String!): Task!
        toggleTask(id: ID!, done: Boolean!): Task!
        deleteTask(id: ID!): Boolean!
      }
    `,
    resolvers: {
      Query: {
        tasks: () => readTasks(), // resolve every time
      },
      Mutation: {
        addTask: (_: any, { title }: { title: string }) => {
          const tasks = readTasks();
          const newTask = { id: Date.now().toString(), title, done: false };
          tasks.push(newTask);
          writeTasks(tasks);
          return newTask;
        },
        toggleTask: (_: any, { id, done }: { id: string; done: boolean }) => {
          const tasks = readTasks();
          const index = tasks.findIndex((t) => t.id === id);
          if (index === -1) throw new Error('Not found');
          tasks[index].done = done;
          writeTasks(tasks);
          return tasks[index];
        },
        deleteTask: (_: any, { id }: { id: string }) => {
          const tasks = readTasks().filter((t) => t.id !== id);
          writeTasks(tasks);
          return true;
        },
      },
    },
  }),
  graphqlEndpoint: '/api/graphql',
});

export { yoga as GET, yoga as POST };
