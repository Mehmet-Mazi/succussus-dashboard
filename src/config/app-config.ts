import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Successus Dashboard",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dashboard.`,
  meta: {
    title: "Dashboard -  Successus Logistics Operational Dashboard",
    description:
      "",
  },
};
