import { useState } from 'react';
import { Sparkles, Send, Wand2, Brain, Zap, MessageSquare, Loader2, CheckCircle, Copy } from 'lucide-react';
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

const AIGenerateTask = ({ onApplyToForm }: AIGenerateTaskProps) => {
  useTheme();
  const [prompt, setPrompt] = useState('');
  const [generatedData, setGeneratedData] = useState<GeneratedTaskData | null>(null);
  const [step, setStep] = useState(1);

  const suggestions = [
    {
      icon: Brain,
      title: 'Development Task',
      description: 'Generate development tasks with technical requirements and deadlines',
      prompt: 'Create a development task for implementing user authentication with proper security measures'
    },
    {
      icon: Zap,
      title: 'Bug Fix Task',
      description: 'Create bug fixing tasks with priority and investigation steps',
      prompt: 'Generate a bug fix task for resolving login issues affecting mobile users'
    },
    {
      icon: MessageSquare,
      title: 'Feature Task',
      description: 'Build feature implementation tasks with acceptance criteria',
      prompt: 'Create a task for implementing a new dashboard widget with user customization options'
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStep(2);
    
    setTimeout(() => {
      const mockData: GeneratedTaskData = {
        title: 'AI-Generated Development Task',
        description: 'Implement user authentication system with secure login, password hashing, and session management. Include proper error handling and validation.',
        priority: 'high',
        status: 'todo',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      setGeneratedData(mockData);
      setStep(3);
    }, 3000);
  };

  const handleApply = () => {
    if (generatedData && onApplyToForm) {
      onApplyToForm(generatedData);
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    setPrompt(suggestion.prompt);
  };

  return (
    <div className="h-full flex flex-col transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-500/20 dark:to-blue-500/20 rounded-lg border border-green-200 dark:border-green-500/30">
          <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">AI Task Generator</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Let AI create your task structure</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              step >= num 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {step > num ? <CheckCircle className="w-3 h-3" /> : num}
            </div>
            {num < 3 && (
              <div className={`w-8 h-0.5 mx-1 transition-all ${
                step > num ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-300 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Quick Suggestions</h4>
              {suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-800/30 hover:bg-gray-200 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600/50 rounded-lg transition-all text-left group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 bg-gray-200 dark:bg-gray-700/50 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 rounded-lg transition-all">
                        <IconComponent className="w-3 h-3 text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-sm">
                          {suggestion.title}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Or describe your task</h4>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what kind of task you want to generate..."
                  className="w-full h-24 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none text-sm"
                />
                <div className="absolute bottom-2 right-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-sm ${
                      prompt.trim()
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-500/20 dark:to-blue-500/20 rounded-full flex items-center justify-center border border-green-200 dark:border-green-500/30">
                <Loader2 className="w-6 h-6 text-green-600 dark:text-green-400 animate-spin" />
              </div>
            </div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">Generating Your Task</h4>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm text-sm">
              AI is analyzing your requirements...
            </p>
            <div className="mt-4 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {step === 3 && generatedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
              <h4 className="text-base font-medium text-gray-900 dark:text-white">Task Generated!</h4>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Title</label>
                <p className="text-gray-900 dark:text-white mt-1 text-sm">{generatedData.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Priority</label>
                <p className="text-orange-600 dark:text-orange-400 mt-1 capitalize text-sm">{generatedData.priority}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Due Date</label>
                <p className="text-blue-600 dark:text-blue-400 mt-1 text-sm">{new Date(generatedData.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Description</label>
                <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{generatedData.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApply}
                className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg font-medium text-sm"
              >
                <Wand2 className="w-3 h-3" />
                Apply
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700/50 hover:bg-gray-300 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all text-sm">
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setPrompt('');
                setGeneratedData(null);
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Generate another task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerateTask;