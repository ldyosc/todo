import { Task } from '@/types/task';

interface Props {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex justify-start gap-2 items-center border-b py-2">
      <div
        onClick={() => onToggle(task.id, !task.done)}
        className={`cursor-pointer flex-1 ${
          task.done ? 'line-through text-gray-400' : ''
        }`}
      >
        {task.title}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </li>
  );
}
