import React from 'react';
import * as Icons from '@live-looper/icons';

const ICON_GROUPS = {
  Transport: [
    'PlayIcon', 'PauseIcon', 'StopIcon', 'RecordIcon', 'LoopIcon', 'RewindIcon', 'FastForwardIcon'
  ],
  Audio: [
    'MonoIcon', 'StereoIcon', 'MuteIcon', 'VolumeLowIcon', 'VolumeHighIcon', 'PanLeftIcon', 'PanRightIcon'
  ],
  Tracks: [
    'MicrophoneIcon', 'MicrophoneOffIcon', 'HeadphonesIcon', 'AddTrackIcon', 'DeleteTrackIcon'
  ],
  Mixing: [
    'WaveformIcon', 'MetronomeIcon', 'EqIcon', 'MixerIcon', 'GainIcon'
  ],
  Effects: [
    'CompressorIcon', 'LimiterIcon', 'GateIcon', 'SaturatorIcon', 'StereoImagerIcon', 'SpectralAnalyzerIcon'
  ],
  AI: [
    'AiMasteringIcon', 'PitchCorrectIcon', 'StemSeparatorIcon', 'MatchEqIcon'
  ],
  Timing: [
    'TempoIcon', 'TimeSignatureIcon', 'QuantizeIcon', 'GrooveIcon'
  ],
  Arrangement: [
    'ClipIcon', 'FadeInIcon', 'FadeOutIcon', 'CrossfadeIcon', 'SpliceIcon', 'GlueIcon', 'FreezeTrackIcon', 'BounceIcon'
  ]
};

export const IconShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <header className="mb-12 border-b border-zinc-800 pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          DAW Icon Library
        </h1>
        <p className="text-zinc-400 mt-2">
          Previewing all icons in the <code>@live-looper/icons</code> package.
        </p>
      </header>

      <div className="space-y-12">
        {Object.entries(ICON_GROUPS).map(([group, iconNames]) => (
          <section key={group} className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-300 border-l-4 border-indigo-500 pl-3">
              {group}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {iconNames.map(name => {
                const IconComponent = (Icons as any)[name];
                if (!IconComponent) return null;
                
                return (
                  <div 
                    key={name}
                    className="flex flex-col items-center justify-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-indigo-500/50 hover:bg-zinc-900 transition-all group"
                  >
                    <div className="mb-3 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                      <IconComponent width={32} height={32} />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors text-center">
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 pt-8 border-t border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-300 mb-6">Styling Examples</h2>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <Icons.RecordIcon className="text-red-500 animate-pulse" width={48} height={48} />
            <span className="text-xs text-zinc-500">Pulse Red</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icons.PlayIcon className="text-green-500" width={48} height={48} />
            <span className="text-xs text-zinc-500">Solid Green</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icons.MixerIcon className="text-indigo-400 stroke-[3px]" width={48} height={48} />
            <span className="text-xs text-zinc-500">Thick Stroke</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icons.WaveformIcon className="text-purple-400 opacity-50" width={48} height={48} />
            <span className="text-xs text-zinc-500">Opacity</span>
          </div>
        </div>
      </section>
    </div>
  );
};
