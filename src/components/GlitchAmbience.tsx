type GlitchAmbienceProps = {
  reducedMotion: boolean;
};

export function GlitchAmbience({ reducedMotion }: GlitchAmbienceProps) {
  if (reducedMotion) return null;

  return (
    <div className="glitch-ambience" aria-hidden="true">
      <div className="glitch-ambience__rainbow" />
      <div className="glitch-ambience__rainbow glitch-ambience__rainbow--slow" />
      <div className="glitch-ambience__shard glitch-ambience__shard--a" />
      <div className="glitch-ambience__shard glitch-ambience__shard--b" />
      <div className="glitch-ambience__shard glitch-ambience__shard--c" />
      <div className="glitch-ambience__pulse" />
    </div>
  );
}
