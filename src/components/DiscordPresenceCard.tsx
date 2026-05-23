import { useEffect, useState } from "react";

import {
  resolveDiscordHref,
  resolveDiscordUserId,
} from "../content/siteDefaults";

const LANYARD_URL = "https://api.lanyard.rest/v1/users";
const POLL_MS = 30_000;

type LanyardDiscordUser = {
  id?: string;
  username?: string;
  global_name?: string | null;
  display_name?: string | null;
  discriminator?: string;
  avatar?: string | null;
};

type LanyardSpotify = {
  song?: string;
  artist?: string;
};

type LanyardActivity = {
  name?: string;
  type?: number;
  state?: string;
  details?: string;
  emoji?: { id?: string; name?: string; animated?: boolean } | null;
};

type LanyardData = {
  discord_user?: LanyardDiscordUser;
  discord_status?: string;
  activities?: LanyardActivity[];
  listening_to_spotify?: boolean;
  spotify?: LanyardSpotify | null;
};

type CardFetchState =
  | { kind: "loading" }
  | { kind: "ok"; data: LanyardData }
  | { kind: "unavailable"; message?: string };

function discordUserId(): string | undefined {
  return resolveDiscordUserId();
}

function defaultDiscordAvatar(userId: string): string {
  const index = Number((BigInt(userId) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function avatarSrc(u: LanyardDiscordUser | undefined, fallbackId: string): string | null {
  const id = u?.id ?? fallbackId;
  const hash = u?.avatar;
  if (!id) return null;
  if (hash) {
    const ext = hash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=128`;
  }
  return defaultDiscordAvatar(id);
}

function statusLabel(raw: string | undefined): string {
  if (!raw) return "offline";
  if (raw === "dnd") return "Do not disturb";
  return raw.slice(0, 1).toUpperCase() + raw.slice(1);
}

function formatCustomLine(act: LanyardActivity): string {
  const em = act.emoji?.name ?? "";
  const text = act.state ?? act.details ?? act.name ?? "";
  return `${em}${em && text ? " " : ""}${text}`.trim();
}

function statusClass(raw: string | undefined): string {
  switch (raw) {
    case "online":
      return "discord-presence__dot--online";
    case "idle":
      return "discord-presence__dot--idle";
    case "dnd":
      return "discord-presence__dot--dnd";
    default:
      return "discord-presence__dot--offline";
  }
}

export function DiscordPresenceCard() {
  const userId = discordUserId();
  const discordHref = resolveDiscordHref();

  const [state, setState] = useState<CardFetchState>(
    () => (!userId ? { kind: "unavailable", message: "not_configured" } : { kind: "loading" }),
  );

  useEffect(() => {
    if (!userId) {
      setState({ kind: "unavailable", message: "not_configured" });
      return;
    }

    let cancelled = false;
    /** DOM timers are numeric in-browser; avoids Node `@types/node` Timeout clash. */
    let intervalId: number | undefined;

    const poll = async () => {
      try {
        const res = await fetch(`${LANYARD_URL}/${encodeURIComponent(userId)}`, {
          referrerPolicy: "no-referrer",
        });
        const body = (await res.json()) as
          | { success: true; data: LanyardData }
          | { success: false; error?: { message?: string } };

        if (cancelled) return;

        if (body.success) {
          setState({ kind: "ok", data: body.data });
        } else {
          setState({
            kind: "unavailable",
            message: body.error?.message,
          });
        }
      } catch {
        if (!cancelled)
          setState({ kind: "unavailable", message: "network_error" });
      }
    };

    void poll();
    intervalId = window.setInterval(poll, POLL_MS) as number;

    return () => {
      cancelled = true;
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [userId]);

  const du =
    state.kind === "ok" ? state.data.discord_user ?? undefined : undefined;

  const status =
    state.kind === "ok" ? state.data.discord_status ?? "offline" : "offline";

  const avatar = userId ? avatarSrc(du, userId) : null;

  const spotifyListening =
    state.kind === "ok" &&
    state.data.listening_to_spotify &&
    state.data.spotify
      ? state.data.spotify
      : undefined;

  const handleDisplay =
    state.kind === "ok"
      ? (du?.global_name?.trim() ||
          du?.display_name?.trim() ||
          du?.username?.trim() ||
          `User …${userId?.slice(-4) ?? ""}`)
      : "Discord";

  const showSpotify = Boolean(spotifyListening);

  const rawActs = state.kind === "ok" ? (state.data.activities ?? []) : [];

  /** Custom presence line (Discord type 4). */
  const customStatuses = rawActs.filter((a) => a.type === 4);

  const visibleActivities = rawActs.filter((a) => {
    if (a.type === 4) return false;
    if (showSpotify && a.type === 2) return false;
    return true;
  });

  return (
    <div className="discord-presence" aria-labelledby="discord-presence-heading">
      <div className="discord-presence__glow" aria-hidden />

      <div className="discord-presence__face">
        <h2 className="discord-presence__heading" id="discord-presence-heading">
          Discord
        </h2>
        <p className="discord-presence__sub">
          Live presence via{" "}
          <a href="https://github.com/Phineas/lanyard" rel="noopener noreferrer">
            Lanyard
          </a>
          . Bot work? Hit my DMs via the profile link below—no email on this site.
        </p>

        {state.kind === "loading" ? (
          <div className="discord-presence__row discord-presence__row--skeleton">
            <div className="discord-presence__avatar discord-presence__avatar--pulse" />
            <div className="discord-presence__meta">
              <span className="discord-presence__line discord-presence__line--short" />
              <span className="discord-presence__line discord-presence__line--tiny" />
            </div>
          </div>
        ) : (
          <div className="discord-presence__row">
            <div className="discord-presence__avatarWrap">
              {avatar ? (
                <img
                  className="discord-presence__avatar"
                  src={avatar}
                  alt=""
                  width={128}
                  height={128}
                  decoding="async"
                />
              ) : (
                <div className="discord-presence__avatar discord-presence__avatar--fallback" />
              )}
              <span
                className={`discord-presence__dot ${statusClass(status)}`}
                title={`Status: ${statusLabel(status)}`}
              />
            </div>

            <div className="discord-presence__meta">
              <p className="discord-presence__handle">{handleDisplay}</p>
              <p className={`discord-presence__status discord-presence__status--${status}`}>
                <span aria-hidden>{status === "offline" ? "○" : "●"} </span>
                {statusLabel(status)}
              </p>

              {customStatuses.map((act, i) =>
                formatCustomLine(act) ? (
                  <p key={`c-${String(i)}`} className="discord-presence__custom">
                    {formatCustomLine(act)}
                  </p>
                ) : null,
              )}

              {customStatuses.length === 0 &&
                visibleActivities.slice(0, 2).map((act, i) => (
                  <p key={`${act.name}-${String(i)}`} className="discord-presence__activity">
                    <span className="discord-presence__activityName">{act.name}</span>
                    {act.details ? (
                      <>
                        {" "}
                        <span className="discord-presence__activityDetail">
                          · {act.details}
                        </span>
                      </>
                    ) : null}
                    {act.state ? (
                      <span className="discord-presence__activityDetail">
                        {" "}
                        {act.state}
                      </span>
                    ) : null}
                  </p>
                ))}

              {spotifyListening?.song ? (
                <p className="discord-presence__spotify">
                  <span className="discord-presence__spotifyMark">Listening</span>{" "}
                  {spotifyListening.song}
                  {spotifyListening.artist ? (
                    <>
                      {" "}
                      <span className="discord-presence__activityDetail">
                        · {spotifyListening.artist}
                      </span>
                    </>
                  ) : null}
                </p>
              ) : null}

              {!userId ||
              (state.kind === "unavailable" &&
                state.message === "not_configured") ? (
                <p className="discord-presence__hint">
                  Set{" "}
                  <code className="discord-presence__code">VITE_DISCORD_USER_ID</code> when
                  building, then{" "}
                  <a
                    href="https://discord.gg/UrXF2cfJ7F"
                    rel="noopener noreferrer"
                  >
                    join the Lanyard Discord
                  </a>{" "}
                  — that opts you into monitored presence (
                  <a href="https://github.com/Phineas/lanyard#readme">
                    README
                  </a>
                  ). See this repo’s README for env vars.
                </p>
              ) : null}

              {state.kind === "unavailable" &&
              state.message &&
              state.message !== "not_configured" ? (
                <p className="discord-presence__hint discord-presence__hint--warn">
                  {state.message === "network_error"
                    ? "Couldn’t reach Lanyard. Check your connection or try again."
                    : "Presence isn’t public right now — open my profile anyway if you need to reach me for bot work."}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <div className="discord-presence__actions">
          <a
            className="discord-presence__cta"
            href={discordHref}
            rel="noopener noreferrer"
          >
            <span className="discord-presence__ctaDot" aria-hidden />
            Open Discord profile / contact
          </a>
        </div>
      </div>
    </div>
  );
}
