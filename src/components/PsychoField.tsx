type PsychoFieldProps = {
  reducedMotion: boolean;
};

export function PsychoField({ reducedMotion }: PsychoFieldProps) {
  return (
    <div
      className="psycho-field"
      aria-hidden="true"
      data-static={reducedMotion || undefined}
    >
      <div className="psycho-field__parallax psycho-field__parallax--far">
        <div className="psycho-field__blob psycho-field__blob--a" />
        <div className="psycho-field__blob psycho-field__blob--b" />
        <div className="psycho-field__blob psycho-field__blob--c" />
      </div>

      <div className="psycho-field__grain" />

      <div className="psycho-field__parallax psycho-field__parallax--mid">
        <svg className="psycho-field__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <g className="psycho-field__rings" fill="none" stroke="rgba(244,244,255,0.28)" strokeWidth="1">
            <circle cx="1040" cy="340" r="48" />
            <circle cx="1040" cy="340" r="84" />
            <circle cx="1040" cy="340" r="128" />
            <circle cx="1040" cy="340" r="176" stroke="rgba(155,156,255,0.45)" />
            <circle cx="1040" cy="340" r="220" stroke="rgba(125,249,255,0.2)" strokeDasharray="4 10" />
            <path d="M1040 280 L1040 400 M980 340 L1100 340" stroke="rgba(244,244,255,0.4)" />
          </g>

          <g className="psycho-field__slab" fill="none" stroke="rgba(244,244,255,0.32)" strokeWidth="1.2">
            <path d="M180 620 L420 520 L520 620 L280 720 Z" />
            <path d="M320 540 L560 440 L620 510 L380 610 Z" stroke="rgba(155,156,255,0.5)" />
            <path d="M900 700 L1180 620 L1240 700 L960 780 Z" opacity="0.7" />
            <path d="M700 160 L860 120 L900 200 L740 240 Z" stroke="rgba(162,169,245,0.4)" opacity="0.65" />
          </g>

          <path
            className="psycho-field__arc"
            d="M1180 120 C1320 260, 1320 520, 1120 720"
            strokeWidth="2.5"
          />
          <path
            className="psycho-field__arc"
            d="M80 180 C220 320, 180 560, 320 780"
            stroke="rgba(125,249,255,0.4)"
            strokeWidth="2"
          />

          <g stroke="rgba(244,244,255,0.2)" strokeWidth="1" fill="none">
            <path d="M60 80 H220 V160" />
            <path d="M1280 760 H1380 V840" />
            <path d="M40 480 H120" />
            <path d="M1320 200 V280" />
            <path d="M600 40 V120 M560 80 H640" opacity="0.5" />
            <circle cx="240" cy="220" r="6" />
            <circle cx="260" cy="240" r="3" fill="rgba(155,156,255,0.5)" stroke="none" />
          </g>

          <g fill="rgba(155,156,255,0.35)" fontFamily="IBM Plex Mono, monospace" fontSize="11">
            <text x="1180" y="90">DELETE</text>
            <text x="70" y="860"># · * · fx</text>
          </g>
        </svg>
      </div>

      <div className="psycho-field__parallax psycho-field__parallax--near">
        <span className="psycho-field__chrome psycho-field__chrome--a">EXC#3 · CM3</span>
        <span className="psycho-field__chrome psycho-field__chrome--b">Preview · ON</span>
        <span className="psycho-field__chrome psycho-field__chrome--c">fx · wiggle(1,10)</span>
        <span className="psycho-field__chrome psycho-field__chrome--d">2026.7.23</span>
        <span className="psycho-field__chrome psycho-field__chrome--e">release / stream</span>
        <span className="psycho-field__cross psycho-field__cross--1" />
        <span className="psycho-field__cross psycho-field__cross--2" />
        <span className="psycho-field__cursor" />
      </div>
    </div>
  );
}
