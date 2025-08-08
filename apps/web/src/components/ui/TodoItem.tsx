import { CheckCircle, Star, X } from 'lucide-react';

interface TodoItemProps {
  id: string;
  text: string;
  starred: boolean;
  date: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({
  id,
  text,
  starred,
  date,
  completed,
  onToggle,
  onDelete,
}: TodoItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggle(id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {completed && <CheckCircle className="w-3 h-3 text-white" />}
        </button>
        {starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
        <span
          className={`text-gray-300 ${completed ? 'line-through text-gray-500' : ''}`}
        >
          {text}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">
          {date}
        </span>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
