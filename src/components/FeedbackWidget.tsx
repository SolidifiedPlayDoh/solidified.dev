import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useLocation } from "react-router-dom";

import { resolveDiscordHref } from "../content/siteDefaults";
import { scanForAdvertising } from "../lib/feedbackGuards";
import {
  FEEDBACK_OPEN_EVENT,
  isFeedbackEnabled,
  openFeedbackDialog,
  submitFeedback,
  type FeedbackOpenDetail,
} from "../lib/feedback";
import { getTurnstileSiteKey, isTurnstileConfigured } from "../lib/turnstile";
import "../styles/feedback.css";

const MIN_MESSAGE = 8;
const MAX_MESSAGE = 2000;

export function FeedbackWidget() {
  const location = useLocation();
  const titleId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [message, setMessage] = useState("");
  const [context, setContext] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const feedbackReady = isFeedbackEnabled();
  const discordHref = resolveDiscordHref();
  const turnstileSiteKey = getTurnstileSiteKey();
  const captchaReady = isTurnstileConfigured();

  const hidden =
    location.pathname.includes("/femtanylFNF/obs") ||
    location.pathname.endsWith("/femtanylFNF/obs") ||
    location.pathname === "/night" ||
    location.pathname.endsWith("/night");

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    turnstileRef.current?.reset();
  }, []);

  const openDialog = useCallback((detail?: FeedbackOpenDetail) => {
    setOpen(true);
    setStatus("idle");
    setError(null);
    setHoneypot("");
    resetTurnstile();
    if (detail?.context) setContext(detail.context);
    if (detail?.prefill) setMessage(detail.prefill);
  }, [resetTurnstile]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<FeedbackOpenDetail>).detail;
      openDialog(detail);
      setHighlight(true);
      window.setTimeout(() => setHighlight(false), 1400);
    };
    window.addEventListener(FEEDBACK_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(FEEDBACK_OPEN_EVENT, onOpen);
  }, [openDialog]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => textareaRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) {
      setOpen(false);
      return;
    }

    if (!captchaReady) {
      setError("Captcha is not set up yet — try again later or use Discord below.");
      return;
    }

    if (!turnstileToken) {
      setError("Complete the captcha before sending.");
      return;
    }

    const trimmed = message.trim();
    if (trimmed.length < MIN_MESSAGE) {
      setError(`Please write at least ${MIN_MESSAGE} characters.`);
      return;
    }
    if (trimmed.length > MAX_MESSAGE) {
      setError(`Please keep it under ${MAX_MESSAGE} characters.`);
      return;
    }

    const adPreview = scanForAdvertising(trimmed);
    if (adPreview.blocked) {
      setError(adPreview.reason);
      return;
    }

    setStatus("sending");
    setError(null);

    const payload = {
      message: trimmed,
      page: window.location.href,
      context,
      turnstileToken,
    };

    const result = await submitFeedback(payload);
    if (result.ok) {
      setStatus("sent");
      setMessage("");
      setContext(undefined);
      resetTurnstile();
      return;
    }

    setStatus("error");
    setError(
      result.error ||
        (feedbackReady
          ? "Something went wrong — try again or ping me on Discord."
          : "Feedback isn’t wired up — copy your note and use Discord below."),
    );
    resetTurnstile();

    if (!feedbackReady) {
      try {
        await navigator.clipboard.writeText(
          `[solidified.dev feedback — ${payload.page}]\n\n${trimmed}`,
        );
      } catch {
        /* clipboard optional */
      }
    }
  };

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        className={`feedback-fab${highlight ? " feedback-fab--pulse" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => openDialog({ context: document.title })}
      >
        Feedback
      </button>

      {open && (
        <div
          className="feedback-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="feedback-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(ev) => ev.stopPropagation()}
          >
            <header className="feedback-dialog__header">
              <h2 className="feedback-dialog__title" id={titleId}>
                Send feedback
              </h2>
              <button
                type="button"
                className="feedback-dialog__close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </header>

            {status === "sent" ? (
              <div className="feedback-dialog__body">
                <p className="feedback-dialog__success">
                  Thanks — your note was sent.
                </p>
                <button
                  type="button"
                  className="feedback-dialog__primary"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="feedback-dialog__body" onSubmit={handleSubmit}>
                <p className="feedback-dialog__hint">
                  Bugs, weird visuals, missing features — anything on this site. Invite links
                  and ads are blocked. Cloudflare captcha required to send.
                </p>

                <label className="feedback-dialog__label" htmlFor="feedback-message">
                  Message
                </label>
                <textarea
                  ref={textareaRef}
                  id="feedback-message"
                  className="feedback-dialog__textarea"
                  rows={5}
                  maxLength={MAX_MESSAGE}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What felt off? Which page were you on?"
                />

                <div className="feedback-dialog__captcha">
                  {turnstileSiteKey ? (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={turnstileSiteKey}
                      onSuccess={setTurnstileToken}
                      onExpire={resetTurnstile}
                      onError={resetTurnstile}
                      options={{ theme: "dark", size: "normal" }}
                    />
                  ) : (
                    <p className="feedback-dialog__error" role="status">
                      Captcha keys missing — feedback is temporarily disabled.
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  name="company"
                  className="feedback-dialog__honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />

                {error && (
                  <p className="feedback-dialog__error" role="alert">
                    {error}
                  </p>
                )}

                <div className="feedback-dialog__actions">
                  <button
                    type="submit"
                    className="feedback-dialog__primary"
                    disabled={status === "sending" || !captchaReady || !turnstileToken}
                  >
                    {status === "sending" ? "Sending…" : "Send"}
                  </button>
                  <a
                    className="feedback-dialog__secondary"
                    href={discordHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </a>
                  <button
                    type="button"
                    className="feedback-dialog__ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Inline control that opens the global feedback dialog (e.g. Femtanyl about). */
export function FeedbackLink({
  children,
  className,
  prefill,
  context,
}: {
  children: ReactNode;
  className?: string;
  prefill?: string;
  context?: string;
}) {
  return (
    <button
      type="button"
      className={className ?? "feedback-inline-link"}
      onClick={() => openFeedbackDialog({ prefill, context })}
    >
      {children}
    </button>
  );
}
