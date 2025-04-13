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
    <div className="w-full min-h-screen flex flex-col items-center justify-between py-4 sm:py-6 md:py-10 animate-fade-in">
      {/* Top Section - Clock and Greeting */}
      <div className="text-center px-4 pt-12 sm:pt-14">
        <h1 className="text-[6rem] sm:text-[8rem] md:text-[10rem] font-extralight text-white tracking-wide mb-1 sm:mb-2">{formatTime()}</h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light">{greeting}</p>
      </div>
      
      {/* Middle Section - Task Input and Focus Buttons */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 -mt-6 sm:-mt-10 md:-mt-12 px-4">
        <div className="w-full max-w-xl md:max-w-2xl">
          <TaskInput 
            value={task} 
            onChange={onTaskChange} 
            placeholder="What is your main goal for today?"
            className="text-lg sm:text-xl md:text-2xl text-center"
          />
        </div>

        {/* Focus Mode Buttons */}
        <div 
          className={`transition-all duration-300 w-full ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => onStartFocus('pomodoro')}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm sm:text-base transition-colors"
            >
              Pomodoro Focus
            </button>
            <button
              onClick={() => onStartFocus('disconnection')}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm sm:text-base transition-colors"
            >
              Disconnection Mode
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Quote */}
      <div className="text-center px-4">
        <p className="text-white/80 text-sm sm:text-base italic">
          "The greatest project you'll ever work on is you."
        </p>
      </div>
    </div>
  );
};

export default IdleMode;
