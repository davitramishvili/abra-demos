/* Abra demo analytics — anonymous per-page hit counter.
 *
 * Purpose: tell us whether a business we messaged actually OPENS its demo link
 * (we get no read receipts on WhatsApp from a personal number — D35/D41).
 *
 * Operator-view exclusion (D45): Davit checks every site himself before sending,
 * which would otherwise inflate the counts. The email's "view site" buttons carry
 * ?preview=1 — a tagged visit is NEVER counted AND marks this device (localStorage)
 * as the operator's, so all his later checks (any page, any batch) are excluded
 * too. Recipients always receive the CLEAN url (in the pasted message), so they
 * still count. Zero extra work for the operator.
 *
 * Privacy: no cookies, no PII, no fingerprinting. One counterapi.dev counter
 * "bump" per page, per browser session (deduped via sessionStorage). The counter
 * is keyed only by the page's own slug — nothing about the visitor is sent.
 *
 * Robustness: fail-safe — wrapped in try/catch and fired as an <img> beacon, so
 * it can NEVER block or break a demo page even if the counter service is down.
 *
 * Swappable: this is the ONLY place the provider lives. To change provider or
 * namespace, edit NS / the endpoint URL below and redeploy. No account, $0.
 * Read counts (non-incrementing):  GET https://api.counterapi.dev/v1/<NS>/<key>/
 */
(function () {
  try {
    var NS = "abra-demos-r7k2q9";
    var FLAG = "abra_noct"; // this device is the operator's -> never count

    // Operator review visit (?preview=1): flag the device, never count.
    if (location.search.indexOf("preview=1") !== -1) {
      try { localStorage.setItem(FLAG, "1"); } catch (e) {}
      return;
    }
    // Already-flagged operator device: never count.
    try { if (localStorage.getItem(FLAG) === "1") return; } catch (e) {}

    var path = location.pathname.replace(/index\.html?$/i, "");
    path = path.replace(/^\/+|\/+$/g, "").replace(/^abra-demos\/?/, "");
    var key = (path || "home")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64);
    if (!key) return;
    try {
      var sk = "abra_hit_" + key;
      if (sessionStorage.getItem(sk)) return; // one count per session per page
      sessionStorage.setItem(sk, "1");
    } catch (e) {}
    var img = new Image();
    img.onload = img.onerror = function () {};
    img.src = "https://api.counterapi.dev/v1/" + NS + "/" + key + "/up?t=" + Date.now();
  } catch (e) {}
})();
