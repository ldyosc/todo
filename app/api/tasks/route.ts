import { Task } from '@/types/task';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

export async function readTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8'); // async read
    return JSON.parse(data) as Task[];
  } catch (err) {
    console.error('Error reading tasks:', err);
    return []; // return empty array if file is missing or corrupt
  }
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8'); // async write
  } catch (err) {
    console.error('Error writing tasks:', err);
    throw err; // propagate error
  }
}

// GET all tasks
export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

// POST create task
export async function POST(req: Request) {
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const tasks = await readTasks();
  const newTask: Task = { id: Date.now().toString(), title, done: false };
  tasks.push(newTask);
  await writeTasks(tasks);

  return NextResponse.json(newTask, { status: 201 });
}

// PUT update existing task with toggle done
export async function PUT(req: Request) {
  const { id, done, title } = await req.json();
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (title !== undefined) tasks[index].title = title;
  if (done !== undefined) tasks[index].done = done;

  await writeTasks(tasks);
  return NextResponse.json(tasks[index]);
}

// DELETE task
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const tasks = await readTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  await writeTasks(filtered);

  return NextResponse.json({ message: 'Deleted successfully' });
}
