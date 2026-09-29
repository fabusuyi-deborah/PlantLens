export const repoUrl = "https://github.com/fabusuyi-deborah/PlantLens";

/** Opens a pre-filled GitHub issue for reporting a data problem. */
export function reportIssueUrl(plantName: string): string {
  const params = new URLSearchParams({
    title: `Data issue: ${plantName}`,
    body: `**Plant:** ${plantName}\n\n**What looks wrong?**\n\n**Source (if you have one):**\n`,
  });
  return `${repoUrl}/issues/new?${params}`;
}
