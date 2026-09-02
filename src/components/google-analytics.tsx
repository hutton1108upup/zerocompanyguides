export const googleAnalyticsMeasurementId = "G-V8KC7HD1PW";

const googleAnalyticsBootstrap = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsMeasurementId}');
`;

export function GoogleAnalytics() {
  return (
    <>
      <script
        async
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{ __html: googleAnalyticsBootstrap }}
        id="google-analytics-bootstrap"
      />
    </>
  );
}
