import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <Particles
        id="tsparticles"
        className="w-full h-full"
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#a855f7", "#06b6d4", "#c084fc", "#38bdf8"],
            },
            links: {
              color: "#a855f7",
              distance: 140,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.8,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 45,
            },
            opacity: {
              value: { min: 0.2, max: 0.6 },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1.5, max: 3.5 },
            },
          },
          detectRetina: true,
        }}
      />
      {/* Subtle ambient gradient mesh glows behind particles */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-900/15 blur-[130px] pointer-events-none" />
    </div>
  );
};
