export const decoyPageCopy = {
  headline: "Decoy",
  lead: "Make joke iPhone home screen apps. Custom name, custom icon, Safari Add to Home Screen.",
  defaultName: "Fake App",
  defaultMessage: "This app does nothing. That is the joke.",
  defaultBg: "#050508",
  defaultFg: "#f4f4ff",
};

export const decoyInstallSteps = [
  {
    title: "Open the decoy page in Safari",
    body: "Tap your fake app link. Install instructions show up there.",
  },
  {
    title: "Hold the address bar → Share",
    body: "Then More → Add to Home Screen.",
  },
  {
    title: "Open it from the home screen",
    body: "It launches like an app and shows your joke text.",
  },
] as const;
