const extractPaperID = / /.exec.bind(/(?!pdf\/)(\d+(?:\.\d+)?)[^v.]/);
let enabled = true;
// redirect all arix pdf papers to the smart leader
chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    if (enabled) {
      const [paperID] = extractPaperID(url);
      chrome.tabs.create({ url: `https://bytez.com/read/arxiv/${paperID}` });
      // eslint-disable-next-line no-script-url
      return { redirectUrl: "javascript:void(0)" };
    }
  },
  { urls: ["*://arxiv.org/pdf/*"] },
  ["blocking"]
);
// close all tabs that open that (in case anchor had target="none")
chrome.webNavigation.onCreatedNavigationTarget.addListener(
  ({ tabId }) => {
    if (enabled) {
      chrome.tabs.remove(tabId);
    }
  },
  { url: [{ hostContains: "arxiv.org", pathPrefix: "/pdf" }] }
);

chrome.storage.onChanged.addListener(({ settings_v1 }) => {
  enabled = settings_v1?.newValue?.enabled ?? true;
});
