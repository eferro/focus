
import React from 'react';
import { Headphones, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AudioControlsProps {
  isPlaying: boolean;
  selectedType: string;
  onToggle: () => void;
  onTypeChange: (type: string) => void;
}

const AUDIO_OPTIONS = [
  { id: 'rain', label: 'Rain' },
  { id: 'forest', label: 'Forest' },
  { id: 'white', label: 'White Noise' },
  { id: 'waves', label: 'Ocean Waves' },
];

const AudioControls: React.FC<AudioControlsProps> = ({ 
  isPlaying, 
  selectedType, 
  onToggle, 
  onTypeChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Background Sound</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className={`${isPlaying ? 'bg-white/40' : 'bg-white/20'} hover:bg-white/50 border-white/30 text-white`}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <Headphones className="w-4 h-4 mr-1" />
              <span>Playing</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Music className="w-4 h-4 mr-1" />
              <span>Play</span>
            </div>
          )}
        </Button>
      </div>

      <RadioGroup 
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-2 gap-2"
      >
        {AUDIO_OPTIONS.map(option => (
          <div key={option.id} className="flex items-center space-x-1">
            <RadioGroupItem 
              value={option.id} 
              id={option.id}
              className="text-white"
            />
            <Label 
              htmlFor={option.id}
              className="text-sm text-white/90"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AudioControls;
