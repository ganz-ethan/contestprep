// Site configuration. Edit this file; it is loaded before everything else.
//
// logEndpoint: the URL of YOUR collector for anonymous right/wrong data (see collector/README.md).
//   "" (empty) means logging is completely OFF: nothing is ever sent anywhere and no consent prompt is shown.
//   Even when set, data is sent only for visitors who click "Yes, share" (default is no).
window.CP_CONFIG = {
  // community: real shared accounts, friends and forum. Empty = demo mode (kept only in each visitor's own browser).
  // See community/README.md. The anon key is public by design; never put a service_role key here.
  community: { supabaseUrl: "", anonKey: "" },
  logEndpoint: "",
};
