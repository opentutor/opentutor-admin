import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from "@simonsmith/cypress-image-snapshot/plugin";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on);
    },
    baseUrl: "http://localhost:8000",
    chromeWebSecurity: false,
    video: false,
    requestTimeout: 10000,
  },
});
