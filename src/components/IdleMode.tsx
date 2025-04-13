import React from 'react';
import TaskInput from './TaskInput';

interface IdleModeProps {
  time: Date | null;
  greeting: string;
  task: string;
  onTaskChange: (task: string) => void;
  onStartFocus: (mode: 'pomodoro' | 'disconnection' | null) => void;
  showControls: boolean;
  formatTime: () => string;
}

const IdleMode: React.FC<IdleModeProps> = ({
  greeting,
  task,
  onTaskChange,
  onStartFocus,
  showControls,
  formatTime
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between py-20 animate-fade-in">
      {/* Top Section - Clock and Greeting */}
      <div className="text-center">
        <h1 className="text-[12rem] font-extralight text-white tracking-wide mb-4">{formatTime()}</h1>
        <p className="text-4xl text-white/90 font-light">{greeting}</p>
      </div>
      
      {/* Middle Section - Task Input and Focus Buttons */}
      <div className="flex flex-col items-center gap-12 -mt-20">
        <div className="w-full max-w-2xl">
          <TaskInput 
            value={task} 
            onChange={onTaskChange} 
            placeholder="What is your main goal for today?"
            className="text-2xl text-center"
          />
        </div>

        {/* Focus Mode Buttons */}
        <div 
          className={`transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex gap-6">
            <button
              onClick={() => onStartFocus('pomodoro')}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-lg transition-colors"
            >
              Pomodoro Focus
            </button>
            <button
              onClick={() => onStartFocus('disconnection')}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-lg transition-colors"
            >
              Disconnection Mode
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Quote */}
      <div className="text-center">
        <p className="text-white/80 text-lg italic">
          "The greatest project you'll ever work on is you."
        </p>
      </div>
    </div>
  );
};

export default IdleMode;
