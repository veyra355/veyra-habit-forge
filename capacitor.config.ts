import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.veyra.app",
  appName: "Veyra",
  webDir: "dist",
  server: { androidScheme: "https" },
};

export default config;
