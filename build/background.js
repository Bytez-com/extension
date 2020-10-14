const regExpToParsePaperID = /pdf\/(\d+(?:\.\d+)?)[^v.]?/;

chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    const paperID = regExpToParsePaperID.exec(url)[1];
    chrome.tabs.create({ url: `https://bytez.com/read/arxiv/${paperID}` });
    // eslint-disable-next-line no-script-url
    return { redirectUrl: "javascript:void(0)" };
  },
  { urls: ["*://arxiv.org/pdf/*"] },
  ["blocking"]
);
// close all tabs that open that (in case anchor had target="none")
chrome.webNavigation.onCreatedNavigationTarget.addListener(
  ({ tabId }) => chrome.tabs.remove(tabId),
  { url: [{ hostContains: "arxiv.org", pathPrefix: "/pdf" }] }
);
