import "../styles/night-removed.css";

export function NightRemovedPage() {
  return (
    <main className="night-removed">
      <p className="night-removed__eyebrow">solidified.dev / night</p>
      <h1 className="night-removed__title">This page was removed</h1>
      <p className="night-removed__body">
        Sorry about that — this link used to go somewhere else, but I had to take it
        down after someone spammed invites and abused it. I&apos;m really sorry if you
        were sent here and that caused any confusion or annoyance.
      </p>
      <p className="night-removed__body night-removed__body--dim">
        If you need me, use the contact options on the main site.
      </p>
      <a className="night-removed__link" href="/">
        ← Back to solidified.dev
      </a>
    </main>
  );
}
