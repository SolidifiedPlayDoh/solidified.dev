import "../styles/wow.css";

const STICKER = `${import.meta.env.BASE_URL}wow-sticker.png`;

export function WowPage() {
  return (
    <main className="wow-prank">
      <h1 className="wow-prank__title">YOU WISH</h1>
      <p className="wow-prank__kicker">tricked ya</p>
      <img
        className="wow-prank__sticker"
        src={STICKER}
        alt=""
        width={160}
        height={160}
        draggable={false}
      />
      <p className="wow-prank__punchline">
        hahha you are <strong>NOT</strong> getting solidifiedplaydoh exclusive content you
        horny bastard
      </p>
      <a className="wow-prank__link" href="/">
        ← leave
      </a>
    </main>
  );
}
