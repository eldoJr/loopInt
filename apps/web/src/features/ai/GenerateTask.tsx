import { useState } from 'react';
import { Sparkles, Send, Wand2, Brain, Zap, MessageSquare, Loader2, CheckCircle, Copy, Download } from 'lucide-react';

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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
          <Sparkles className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Task Generator</h3>
          <p className="text-sm text-gray-400">Let AI create your task structure and details</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step >= num 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step > num ? <CheckCircle className="w-4 h-4" /> : num}
            </div>
            {num < 3 && (
              <div className={`w-12 h-0.5 mx-2 transition-all ${
                step > num ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Suggestions</h4>
              {suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-4 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 rounded-lg transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-700/50 group-hover:bg-green-500/20 rounded-lg transition-all">
                        <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-white group-hover:text-green-400 transition-colors">
                          {suggestion.title}
                        </h5>
                        <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Or describe your task</h4>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what kind of task you want to generate..."
                  className="w-full h-32 bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      prompt.trim()
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-green-500/25'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full animate-pulse" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Generating Your Task</h4>
            <p className="text-gray-400 text-center max-w-sm">
              AI is analyzing your requirements and creating a comprehensive task structure...
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {step === 3 && generatedData && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-medium text-white">Task Generated Successfully!</h4>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title</label>
                <p className="text-white mt-1">{generatedData.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Priority</label>
                <p className="text-orange-400 mt-1 capitalize">{generatedData.priority}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Due Date</label>
                <p className="text-blue-400 mt-1">{new Date(generatedData.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Description</label>
                <p className="text-gray-300 mt-1">{generatedData.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-green-500/25 font-medium"
              >
                <Wand2 className="w-4 h-4" />
                Apply to Form
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all">
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-lg transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setPrompt('');
                setGeneratedData(null);
              }}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
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