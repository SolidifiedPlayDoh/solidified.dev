import { useEffect, useRef, useState } from "react";

import { formatFallenLine, registerWowFall } from "../lib/wowCounter";
import "../styles/wow.css";

const STICKER = `${import.meta.env.BASE_URL}wow-sticker.png`;

export function WowPage() {
  const [fallenLine, setFallenLine] = useState(formatFallenLine(null));
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    void registerWowFall().then((n) => setFallenLine(formatFallenLine(n)));
  }, []);

  return (
    <>
      <p className="wow-prank__counter" aria-live="polite">
        {fallenLine}
      </p>
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
    </>
  );
}
