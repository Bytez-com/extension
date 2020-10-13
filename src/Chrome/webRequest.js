/* global chrome */
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(details);
    return { cancel: true };
  },
  { urls: ["*://*arxiv.org/pdf/*"] },
  ["blocking"]
);
