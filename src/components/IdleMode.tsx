
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
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-9xl font-extralight text-white tracking-wide mb-2">{formatTime()}</h1>
        <p className="text-3xl text-white/90 font-light">{greeting}</p>
      </div>
      
      <div className="w-full max-w-xl">
        <TaskInput 
          value={task} 
          onChange={onTaskChange} 
          placeholder="What is your main goal for today?"
          className="text-xl text-center"
        />
      </div>
      
      <div className="absolute bottom-20 w-full text-center">
        <p className="text-white/80 text-sm italic">
          "The greatest project you'll ever work on is you."
        </p>
      </div>
      
      <div 
        className={`absolute top-20 right-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onStartFocus('pomodoro')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
          >
            Pomodoro Focus
          </button>
          <button
            onClick={() => onStartFocus('disconnection')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
          >
            Disconnection Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdleMode;
