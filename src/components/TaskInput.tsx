
import React from 'react';
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  value: string;
  onChange: (task: string) => void;
  placeholder?: string;
  className?: string;
}

const TaskInput: React.FC<TaskInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter your task...",
  className = ""
}) => {
  return (
    <div className="space-y-2 w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-transparent border-x-0 border-t-0 border-b border-white/30 rounded-none text-white placeholder:text-white/50 focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0 py-2 ${className}`}
      />
    </div>
  );
};

export default TaskInput;
