import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Music } from 'lucide-react';
import type { SoundOption } from '@/assets/audio';

interface SoundSelectorProps {
  currentSound: SoundOption;
  sounds: SoundOption[];
  onSoundChange: (soundId: string) => void;
}

const SoundSelector: React.FC<SoundSelectorProps> = ({
  currentSound,
  sounds,
  onSoundChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 relative"
        >
          <Music className="h-4 w-4" />
          <span className="absolute -bottom-1 -right-1 text-xs">
            {currentSound.icon}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48 bg-white/10 backdrop-blur-lg border-white/20">
        {sounds.map((sound) => (
          <DropdownMenuItem
            key={sound.id}
            onClick={() => onSoundChange(sound.id)}
            className={`flex items-center gap-2 text-white hover:bg-white/20 cursor-pointer ${
              currentSound.id === sound.id ? 'bg-white/10' : ''
            }`}
          >
            <span>{sound.icon}</span>
            <span>{sound.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SoundSelector; 