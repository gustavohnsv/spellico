import React from 'react';
import { WizardAvatar } from '../components/WizardAvatar';
import { HealthBar } from '../components/HealthBar';
import { AbilityHUD } from '../components/AbilityHUD';
import { CommandInput } from '../components/CommandInput';

export default function Arena() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-serif tracking-widest overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between p-8 sm:p-12">

        <div className="flex justify-end items-start"> {/* Top Section: Enemy */}
          <div className="flex flex-col items-center gap-4">
            <HealthBar current={100} max={100} type="enemy" />
            <WizardAvatar type="enemy" />
          </div>
        </div>

        <div className="flex justify-center items-center"> {/* Middle Section: Command Input */}
          <CommandInput />
        </div>

        <div className="flex justify-start items-end"> {/* Bottom Section: Player */}
          <div className="flex flex-col items-center gap-4">
            <WizardAvatar type="player" />
            <HealthBar current={100} max={100} type="player" />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex justify-center pb-8"> {/* HUD: Base da tela */}
        <AbilityHUD />
      </div>
    </div>
  );
}
