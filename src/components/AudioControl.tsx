import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  isPlaying: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

const AudioControl: React.FC<AudioControlProps> = ({
  isPlaying,
  volume,
  onToggle,
  onVolumeChange
}) => {
  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-white hover:bg-white/20"
      >
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
      
      <div className="w-24">
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(values) => onVolumeChange(values[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AudioControl; 