import { Task } from '@/types/task';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

// Helper to read/write JSON
function readTasks(): Task[] {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}
function writeTasks(tasks: Task[]) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// GET all tasks
export async function GET() {
  const tasks = readTasks();
  return NextResponse.json(tasks);
}

// POST create task
export async function POST(req: Request) {
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const tasks = readTasks();
  const newTask: Task = { id: Date.now().toString(), title, done: false };
  tasks.push(newTask);
  writeTasks(tasks);

  return NextResponse.json(newTask, { status: 201 });
}

// PUT update existing task with toggle done
export async function PUT(req: Request) {
  const { id, done, title } = await req.json();
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (title !== undefined) tasks[index].title = title;
  if (done !== undefined) tasks[index].done = done;

  writeTasks(tasks);
  return NextResponse.json(tasks[index]);
}

// DELETE task
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const tasks = readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  writeTasks(filtered);

  return NextResponse.json({ message: 'Deleted successfully' });
}
