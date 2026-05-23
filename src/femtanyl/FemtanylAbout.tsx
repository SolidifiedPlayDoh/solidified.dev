import { FeedbackLink } from "../components/FeedbackWidget";

const VIDEO_URL = "https://www.youtube.com/watch?v=rigyc6Lesc4";

export function FemtanylAbout() {
  return (
    <section className="femtanyl-about" aria-labelledby="femtanyl-about-heading">
      <h2 id="femtanyl-about-heading" className="femtanyl-about__heading">
        About this page
      </h2>
      <div className="femtanyl-about__body">
        <p>
          I saw{" "}
          <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer">
            this YouTube video
          </a>{" "}
          of the Femtanyl FNF mod and wanted to unpack the mod files and turn them into a
          web-based animator you can play with in the browser. Chart watch mode, Pico sprites,
          shaders, and the intro sequence were pieced together from the mod assets over a
          long weekend of poking at XML, charts, and Haxe scripts.
        </p>
        <p>
          This is still a fan recreation, not the real game — timing, shaders, and poses might
          be off. If something looks wrong or breaks, please tell me using the{" "}
          <FeedbackLink
            context="Femtanyl FNF animator"
            prefill="Femtanyl animator: "
            className="femtanyl-about__feedback-link"
          >
            Feedback
          </FeedbackLink>{" "}
          button in the bottom-left corner of the page (same one on every page here).
        </p>
      </div>
    </section>
  );
}
