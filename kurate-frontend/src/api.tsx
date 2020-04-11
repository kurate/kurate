const BASE = "https://localhost:8338/api";

export const KURATE_API = {
  Home: BASE + "/albums",
  Album: (id: string) => BASE + KURATE_API.Home + "/" + id,
};
