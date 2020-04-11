export const KURATE_URLS = {
  Home: "/albums",
  Album: (id: string) => KURATE_URLS.Home + "/" + id,
};
