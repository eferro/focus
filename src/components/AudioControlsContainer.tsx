
import React from 'react';
import AudioControls from './AudioControls';

interface AudioControlsContainerProps {
  showControls: boolean;
  isPlaying: boolean;
  currentType: string;
  volume: number;
  togglePlayback: () => void;
  changeType: (type: string) => void;
  adjustVolume: (volume: number) => void;
  isLoading: boolean;
  audioError: string | null;
}

const AudioControlsContainer: React.FC<AudioControlsContainerProps> = ({
  showControls,
  isPlaying,
  currentType,
  volume,
  togglePlayback,
  changeType,
  adjustVolume,
  isLoading,
  audioError
}) => {
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-xs mx-auto">
        <AudioControls 
          isPlaying={isPlaying}
          selectedType={currentType}
          volume={volume}
          onToggle={togglePlayback}
          onTypeChange={changeType}
          onVolumeChange={adjustVolume}
          isLoading={isLoading}
          error={audioError}
        />
      </div>
    </div>
  );
};

export default AudioControlsContainer;
