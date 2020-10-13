/* global chrome */
if (chrome && chrome.webRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      console.log(details);
      return { cancel: true };
    },
    { urls: ["*://*arxiv.org/pdf/*"] },
    ["blocking"]
  );
}
