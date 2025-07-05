interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
}

export const Slider = ({ value, onValueChange, max = 100, min = 0, step = 1, className = '' }: SliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseInt(e.target.value)]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0] || 0}
      onChange={handleChange}
      className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider ${className}`}
      style={{
        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(value[0] / max) * 100}%, #374151 ${(value[0] / max) * 100}%, #374151 100%)`
      }}
    />
  );
};