import "../styles/wow.css";

export function WowPage() {
  return (
    <main className="wow-prank">
      <p className="wow-prank__eyebrow">solidified.dev / wow</p>
      <h1 className="wow-prank__title">You wish.</h1>
      <p className="wow-prank__body">
        This link was never going to be what you hoped. It&apos;s a joke page — bait for
        the curious. You clicked. Respect.
      </p>
      <p className="wow-prank__stinger">&gt;;3</p>
      <a className="wow-prank__link" href="/">
        ← escape to the real site
      </a>
    </main>
  );
}
