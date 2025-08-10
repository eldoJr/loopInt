import { useState } from 'react';
import {
  Sparkles,
  Send,
  Wand2,
  Brain,
  Zap,
  MessageSquare,
  Loader2,
  CheckCircle,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface GeneratedTaskData {
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string;
}

interface AIGenerateTaskProps {
  onApplyToForm?: (data: GeneratedTaskData) => void;
}

// Suggestion templates for quick task generation
const TASK_SUGGESTIONS = [
  {
    icon: Brain,
    title: 'Development Task',
    description: 'Technical implementation with requirements and deadlines',
    prompt: 'Create a development task for implementing user authentication with proper security measures',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Bug Fix Task', 
    description: 'Issue resolution with priority and investigation steps',
    prompt: 'Generate a bug fix task for resolving login issues affecting mobile users',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: MessageSquare,
    title: 'Feature Task',
    description: 'New feature implementation with acceptance criteria',
    prompt: 'Create a task for implementing a new dashboard widget with user customization options',
    color: 'from-purple-500 to-pink-500',
  },
];

// Minimal step indicator
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-1 mb-6">
    {[1, 2, 3].map(num => (
      <div key={num} className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
            currentStep >= num
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
          }`}
        >
          {currentStep > num ? '✓' : num}
        </div>
        {num < 3 && (
          <div
            className={`w-8 h-0.5 mx-1 transition-all ${
              currentStep > num ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

// Compact suggestion card
const SuggestionCard = ({ suggestion, onClick }: { 
  suggestion: typeof TASK_SUGGESTIONS[0]; 
  onClick: () => void; 
}) => {
  const IconComponent = suggestion.icon;
  return (
    <button
      onClick={onClick}
      className="group w-full p-3 bg-gray-50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-emerald-200 dark:hover:border-emerald-500/30 rounded-lg transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 bg-gradient-to-r ${suggestion.color} rounded-md`}>
          <IconComponent className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1">
          <h5 className="font-medium text-gray-900 dark:text-white text-sm">
            {suggestion.title}
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {suggestion.description}
          </p>
        </div>
      </div>
    </button>
  );
};

// Enhanced task preview with modern styling
const TaskPreview = ({ data, isApplied }: { data: GeneratedTaskData; isApplied?: boolean }) => {
  const priorityColors = {
    low: 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20',
    medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20', 
    high: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
  };

  const statusColors = {
    todo: 'text-gray-600 bg-gray-50 dark:bg-gray-500/10',
    in_progress: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    done: 'text-green-600 bg-green-50 dark:bg-green-500/10',
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800/50 border rounded-xl p-4 space-y-4 transition-all ${
      isApplied 
        ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/5' 
        : 'border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600/50'
    }`}>
      {isApplied && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start justify-between gap-3">
        <h5 className="font-semibold text-gray-900 dark:text-white leading-tight">{data.title}</h5>
        <div className="flex gap-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
            priorityColors[data.priority as keyof typeof priorityColors] || priorityColors.medium
          }`}>
            {data.priority}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
        {data.description}
      </p>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/30">
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-1 rounded-md font-medium ${
            statusColors[data.status as keyof typeof statusColors] || statusColors.todo
          }`}>
            {data.status.replace('_', ' ')}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Due: {new Date(data.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

const AIGenerateTask = ({ onApplyToForm }: AIGenerateTaskProps) => {
  useTheme();
  const [prompt, setPrompt] = useState('');
  const [generatedData, setGeneratedData] = useState<GeneratedTaskData | null>(null);
  const [step, setStep] = useState(1);
  const [isApplied, setIsApplied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStep(2);

    setTimeout(() => {
      const mockData: GeneratedTaskData = {
        title: 'AI-Generated Development Task',
        description:
          'Implement user authentication system with secure login, password hashing, and session management. Include proper error handling and validation.',
        priority: 'high',
        status: 'todo',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      };

      setGeneratedData(mockData);
      setStep(3);
    }, 3000);
  };

  const handleApply = () => {
    if (generatedData && onApplyToForm) {
      onApplyToForm(generatedData);
      setIsApplied(true);
    }
  };

  const handleSuggestionClick = (suggestion: typeof TASK_SUGGESTIONS[0]) => {
    setPrompt(suggestion.prompt);
  };

  const handleReset = () => {
    setStep(1);
    setPrompt('');
    setGeneratedData(null);
    setIsApplied(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Task Generator
            </h3>
          </div>
        </div>
        {step > 1 && (
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <StepIndicator currentStep={step} />

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Start
              </h4>
              <div className="space-y-1.5">
                {TASK_SUGGESTIONS.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    suggestion={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Task
              </h4>
              <div className="space-y-2">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe your task..."
                  className="w-full h-20 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    prompt.trim()
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Generate Task
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
              Generating Task
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              AI is creating your task...
            </p>
          </div>
        )}

        {step === 3 && generatedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Task Generated
              </h4>
            </div>

            <TaskPreview data={generatedData} isApplied={isApplied} />

            {!isApplied ? (
              <div className="space-y-3">
                <button
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow-md"
                >
                  <Wand2 className="w-4 h-4" />
                  Apply to Form
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-lg transition-all text-sm">
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Applied to form successfully!
                </div>
                <button
                  onClick={handleReset}
                  className="block mx-auto mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  Generate another task →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerateTask;
