export const theme = {
  color: {
    ink: "#14171C",
    paper: "#F7F5F0",
    signal: "#1F7A5C",   // positive / score-good
    signalSoft: "#E4EEE8",
    alert: "#C2542F",    // gaps / missing keywords
    alertSoft: "#F3E5DE",
    hairline: "#DEDAD0",
    mute: "#6B6760",
  },
  font: {
    display: '"Fraunces", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"IBM Plex Mono", monospace',
  },
  radius: {
    sm: "2px",   // deliberately near-zero — instrument, not bubbly app
    md: "4px",
  },
} as const;