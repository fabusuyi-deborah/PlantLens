/** Site-wide links and settings, kept in one place. */
export const site = {
  /** Where the site is deployed; used for absolute link-preview URLs. */
  url: "https://plant-lens-beta.vercel.app",
  repoUrl: "https://github.com/fabusuyi-deborah/PlantLens",
  /**
   * Google Form where readers suggest corrections. While empty, the "Tell us here" and
   * "Report a correction" links stay hidden.
   */
  correctionsFormUrl: "",
  curator: {
    name: "Deborah Fabusuyi",
    github: "https://github.com/fabusuyi-deborah",
    linkedin: "https://www.linkedin.com/in/deborah-fabusuyi/",
    x: "https://x.com/Debbyiecodes",
    hashnode: "https://hashnode.com/@Dherrbie",
  },
} as const;
