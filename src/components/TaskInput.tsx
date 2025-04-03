
import React from 'react';
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  value: string;
  onChange: (task: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-sm font-medium">
        What are you focusing on?
      </label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your task..."
        className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white focus:ring-white"
      />
      <p className="text-xs text-white/70 italic">
        Your task will be saved for future sessions
      </p>
    </div>
  );
};

export default TaskInput;
