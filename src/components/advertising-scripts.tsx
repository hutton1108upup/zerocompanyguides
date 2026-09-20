const popunderScriptUrl =
  "https://pl31426954.profitableratecpmnetwork.com/04/b3/48/04b348dffa1f19e7124eacf90c1414a4.js";

const nativeBannerScriptUrl =
  "https://pl31426956.profitableratecpmnetwork.com/96272942accec8aba062ea528ff5e99c/invoke.js";

const nativeBannerContainerId =
  "container-96272942accec8aba062ea528ff5e99c";

export function AdvertisingScripts() {
  return (
    <>
      {/* Keep the vendor-provided synchronous loading behavior. */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script id="profitablerate-popunder" src={popunderScriptUrl} />
      <script
        async
        data-cfasync="false"
        id="profitablerate-native-banner"
        src={nativeBannerScriptUrl}
      />
      <div id={nativeBannerContainerId} />
    </>
  );
}
