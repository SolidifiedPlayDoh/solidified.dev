export const matrixHomeserver = "https://matrix.solidified.dev";
export const matrixServerName = "solidified.dev";

export const matrixNoticeCopy = {
  title: "Matrix server live",
  body: [
    "I'm hosting a public Matrix homeserver at matrix.solidified.dev — open signup, public communities, no Discord required.",
    "Create an account, browse spaces in Explore, and join what you want. Nothing is forced on you.",
  ],
  learnMoreLabel: "What is Matrix?",
  dismissLabel: "Nice",
};

export const matrixPageCopy = {
  headline: "Matrix",
  lead: "A federated chat network — like email, but for real-time rooms. I run a homeserver you can join.",
  sections: [
    {
      id: "what",
      title: "What is Matrix?",
      body: [
        "Matrix is an open protocol for secure, decentralized chat. Anyone can run a homeserver; users get an ID like @you:solidified.dev and can talk to people on other servers too (federation).",
        "Think IRC or Discord, except your account and communities aren't locked to one company's app. Pick any compatible client — Element, Cinny, FluffyChat, and others all work.",
      ],
    },
    {
      id: "server",
      title: "Solidified.dev homeserver",
      body: [
        "I host Synapse at matrix.solidified.dev. Registration is open — sign up and you're @username:solidified.dev.",
        "Public communities (Lounge, Tech Talk, Gaming, Creative) show up in your client's Explore menu. Join only what you want; new accounts start with an empty sidebar.",
      ],
      homeserver: matrixHomeserver,
    },
    {
      id: "join",
      title: "How to join",
      steps: [
        {
          title: "Pick a client",
          body: "Element (web or desktop), Cinny (web), or FluffyChat (mobile) are good starts. Links below.",
        },
        {
          title: "Create an account",
          body: `Choose "Create account" / "Register". Set homeserver to ${matrixHomeserver} — not matrix.org.`,
        },
        {
          title: "Choose a username",
          body: "Pick any available name. Your full ID will be @username:solidified.dev.",
        },
        {
          title: "Find communities",
          body: `Open Explore / Room directory, enter ${matrixServerName}, filter to Spaces, and join communities you like.`,
        },
      ],
    },
    {
      id: "clients",
      title: "Clients",
      links: [
        { label: "Element Web", href: "https://app.element.io/" },
        { label: "Cinny", href: "https://cinny.in/" },
        { label: "FluffyChat", href: "https://fluffychat.im/" },
        { label: "Client list (matrix.org)", href: "https://matrix.org/ecosystem/clients/" },
      ],
    },
  ],
};
