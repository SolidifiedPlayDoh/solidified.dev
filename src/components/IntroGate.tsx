type IntroGateProps = {
  onPress: () => void;
};

export function IntroGate({ onPress }: IntroGateProps) {
  return (
    <div className="intro-inner">
      <button className="press-btn" type="button" onClick={onPress} autoFocus>
        Press to continue
      </button>
    </div>
  );
}
