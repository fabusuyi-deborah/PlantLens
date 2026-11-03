import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: every page is either static or rendered per request,
// and nothing here uses ISR or revalidate.
export default defineCloudflareConfig();
