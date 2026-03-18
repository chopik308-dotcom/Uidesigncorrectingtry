import { useState, useEffect } from 'react';
import { EchoText } from './components/EchoText';
import { Scanlines } from './components/Scanlines';
import { ParallaxContainer } from './components/ParallaxContainer';
import { NoiseTexture } from './components/NoiseTexture';
import { TerminalInput } from './components/TerminalInput';
import { GridOverlay } from './components/GridOverlay';
import { GlitchOverlay } from './components/GlitchOverlay';
import { AmbientGlow } from './components/AmbientGlow';
import { CustomCursor } from './components/CustomCursor';
import { screens } from './data/screens';

export default function App() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentScreen = screens[currentScreenIndex];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setDirection(1);
        setCurrentScreenIndex((prev) => (prev + 1) % screens.length);
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setCurrentScreenIndex((prev) => (prev - 1 + screens.length) % screens.length);
      } else if (/^[1-9]$/.test(e.key)) {
        const targetIndex = parseInt(e.key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < screens.length) {
          setDirection(0);
          setCurrentScreenIndex(targetIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const isWelcomeScreen = currentScreen.id === 'access-gateway';
  const jumpHint = `1-${screens.length} JUMP`;

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#030507' }}>
      <GridOverlay />
      <Scanlines />
      <NoiseTexture />
      <GlitchOverlay />
      <AmbientGlow />

      {/* Navigation hints */}
      <div className="fixed top-6 right-6 z-40 flex gap-4 opacity-30 hover:opacity-60 transition-opacity">
        <EchoText text="← / → NAVIGATE" severity="info" animHint="steady" className="text-xs font-mono" />
        <EchoText text={jumpHint} severity="info" animHint="steady" className="text-xs font-mono" />
      </div>

      {/* Screen indicator */}
      <div className="fixed top-6 left-6 z-40 flex gap-2">
        {screens.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScreenIndex(index)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: index === currentScreenIndex ? '#F83D3D' : '#A6B0B9',
              boxShadow: index === currentScreenIndex ? '0 0 10px rgba(248, 61, 61, 0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Main content area with overscan */}
      <div className="relative w-[144vw] h-[130vh] -ml-[22vw] -mt-[15vh]">
        <ParallaxContainer depth={0.5}>
          <div className="flex items-center justify-center min-h-screen px-12">
            <div key={`${currentScreenIndex}-${direction}`} className="w-full max-w-4xl space-y-12">
              {/* Title */}
              <div className="mb-16 relative inline-block">
                {isWelcomeScreen && (
                  <>
                    <div
                      className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap text-4xl font-mono tracking-wider"
                      style={{ color: 'rgba(242, 247, 255, 0.17)', transform: 'translate(1px, 4px)' }}
                    >
                      {currentScreen.title}
                    </div>
                    <div
                      className="absolute top-0 left-0 pointer-events-none select-none whitespace-pre-wrap text-4xl font-mono tracking-wider"
                      style={{ color: 'rgba(248, 61, 61, 0.2)', transform: 'translate(4px, -3px)' }}
                    >
                      {currentScreen.title}
                    </div>
                  </>
                )}

                <EchoText
                  text={currentScreen.title}
                  severity="info"
                  animHint="steady"
                  palette={isWelcomeScreen ? 'cold' : 'default'}
                  className="text-4xl font-mono tracking-wider"
                />
              </div>

              {/* Sections */}
              {currentScreen.sections.map((section, sectionIndex) => (
                <ParallaxContainer key={section.name} depth={0.3 + sectionIndex * 0.1}>
                  <div className="space-y-6">
                    {/* Section header */}
                    <div className="mb-4 opacity-50">
                      <EchoText
                        text={`// ${section.name.toUpperCase()}`}
                        severity="info"
                        animHint="steady"
                        palette={isWelcomeScreen ? 'cold' : 'default'}
                        delay={sectionIndex * 100}
                        className="text-sm font-mono tracking-widest"
                      />
                    </div>

                    {/* Section lines */}
                    <div className="space-y-3 pl-6">
                      {section.lines.map((line, lineIndex) => {
                        // Special handling for SESSION ANCHOR INPUT
                        if (currentScreen.id === 'session-anchor' && section.name === 'Primary' && line.key === 'PLACEHOLDER') {
                          return (
                            <div key={line.key} className="mt-6 mb-6">
                              <TerminalInput placeholder={line.text} onSubmit={(value) => console.log('Submitted:', value)} />
                            </div>
                          );
                        }

                        // Intake drop/paste zone for raw context
                        if (currentScreen.id === 'raw-intake' && line.key === 'DROPZONE') {
                          return (
                            <div
                              key={line.key}
                              className="relative mt-5 mb-5 border px-6 py-6"
                              style={{
                                borderColor: 'rgba(242, 247, 255, 0.24)',
                                boxShadow: 'inset 0 0 24px rgba(242, 247, 255, 0.06), 0 0 18px rgba(248, 61, 61, 0.14)',
                              }}
                            >
                              <EchoText
                                text="[ DRAG / DROP / PASTE ]"
                                severity="critical"
                                animHint="pulse_soft"
                                palette="cold"
                                className="text-xl font-mono tracking-wider"
                              />
                              <div className="mt-4 space-y-2 opacity-80">
                                <EchoText
                                  text="TELEGRAM_EXPORT.ZIP // WHATSAPP_EXPORT.TXT // NOTES_ARCHIVE.MD"
                                  severity="info"
                                  animHint="steady"
                                  palette="cold"
                                  className="text-sm font-mono"
                                />
                                <EchoText
                                  text="RAW INTAKE ONLY :: CLEANING + FILTERING RUNS AFTER SUBMIT"
                                  severity="warning"
                                  animHint="steady"
                                  palette="cold"
                                  className="text-sm font-mono"
                                />
                              </div>
                            </div>
                          );
                        }

                        // Special handling for COUNTDOWN
                        if (currentScreen.id === 'orientation' && section.name === 'Anchor' && line.key === 'COUNTDOWN') {
                          return (
                            <div key={line.key} className="flex items-center gap-4">
                              <EchoText
                                text={line.text}
                                severity={line.severity}
                                animHint={line.animHint}
                                delay={sectionIndex * 200 + lineIndex * 150}
                                className="text-6xl font-mono leading-relaxed"
                              />
                              <div className="flex flex-col gap-1">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-16 h-1"
                                    style={{
                                      backgroundColor: i < parseInt(line.text, 10) ? '#F83D3D' : '#A6B0B9',
                                      opacity: i < parseInt(line.text, 10) ? 0.8 : 0.2,
                                      boxShadow: i < parseInt(line.text, 10) ? '0 0 8px rgba(248, 61, 61, 0.5)' : 'none',
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={line.key} className="flex items-start">
                            <EchoText
                              text={line.text}
                              severity={line.severity}
                              animHint={line.animHint}
                              palette={isWelcomeScreen || currentScreen.id === 'raw-intake' ? 'cold' : 'default'}
                              delay={sectionIndex * 200 + lineIndex * 150}
                              className="text-lg font-mono leading-relaxed"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ParallaxContainer>
              ))}
            </div>
          </div>
        </ParallaxContainer>
      </div>

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(3, 5, 7, 0.5) 100%)',
        }}
      />

      {/* Footer info */}
      <div className="fixed bottom-6 left-6 z-40 opacity-20">
        <EchoText
          text={`SCREEN ${currentScreenIndex + 1}/${screens.length} // ${currentScreen.id.toUpperCase()}`}
          severity="info"
          animHint="steady"
          palette={isWelcomeScreen || currentScreen.id === 'raw-intake' ? 'cold' : 'default'}
          className="text-xs font-mono"
        />
      </div>

      {/* Custom cursor */}
      <CustomCursor />
    </div>
  );
}
