import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchSecretPressCount,
  formatFallenLine,
  incrementSecretPress,
  registerWowFall,
} from "../lib/wowCounter";
import "../styles/wow.css";

const STICKER = `${import.meta.env.BASE_URL}wow-sticker.png`;

export function WowPage() {
  const [fallenLine, setFallenLine] = useState(formatFallenLine(null));
  const [secretPresses, setSecretPresses] = useState<number | null>(null);
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current) return;
    registered.current = true;
    void registerWowFall().then((n) => setFallenLine(formatFallenLine(n)));
    void fetchSecretPressCount().then(setSecretPresses);
  }, []);

  const onSecretPress = useCallback(() => {
    void incrementSecretPress().then((n) => {
      if (n != null) setSecretPresses(n);
    });
  }, []);

  return (
    <>
      <p className="wow-prank__counter" aria-live="polite">
        {fallenLine}
      </p>

      <div className="wow-secret">
        <p className="wow-secret__label">
          secret button
          <span className="wow-secret__arrow" aria-hidden>
            ↓
          </span>
        </p>
        <div className="wow-secret__row">
          <button
            type="button"
            className="wow-secret__btn"
            onClick={onSecretPress}
            aria-label="Secret button"
          />
          <span className="wow-secret__count" aria-live="polite">
            {secretPresses ?? "…"}
          </span>
        </div>
      </div>

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
