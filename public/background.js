const extractPaperID = / /.exec.bind(/(?!pdf\/)(\d+(?:\.\d+)?)[^v.]/);
let extensionEnabled = true;
let alreadySyncing = false;
let whiteList = {};
let timeoutID;
//
//
// redirect all arix pdf papers to the smart leader
chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    const whiteListedPaperID = checkIfWhiteListed(url);

    if (whiteListedPaperID) {
      chrome.tabs.create({
        url: `https://bytez.com/read/arxiv/${whiteListedPaperID}`
      });
      // eslint-disable-next-line no-script-url
      return { redirectUrl: "javascript:void(0)" };
    }
  },
  { urls: ["*://arxiv.org/pdf/*"] },
  ["blocking"]
);
// close all tabs that open that (in case anchor had target="none")
chrome.webNavigation.onCreatedNavigationTarget.addListener(
  ({ url, tabId }) => {
    if (checkIfWhiteListed(url)) {
      chrome.tabs.remove(tabId);
    }
  },
  { url: [{ hostContains: "arxiv.org", pathPrefix: "/pdf" }] }
);

chrome.storage.onChanged.addListener(async ({ settings_v1 }) => {
  try {
    extensionEnabled = settings_v1?.newValue?.enabled ?? true;

    if (extensionEnabled) {
      await syncSupportedPaperIDs();
    } else {
      clearTimeout(timeoutID);
    }
  } catch (error) {
    console.error(error);
  }
});
function checkIfWhiteListed(url) {
  if (extensionEnabled) {
    const [paperID] = extractPaperID(url);
    return whiteList[paperID] ? paperID : undefined;
  }
}
async function syncSupportedPaperIDs() {
  try {
    if (alreadySyncing === false) {
      alreadySyncing = true;

      const listOfPaperIDs = await fetch(
        "https://api.bytez.com/papers"
      ).then(res => res.json());
      // reset the supported object
      whiteList = {};
      // set each paperID to true
      for (const paperID of listOfPaperIDs) {
        whiteList[paperID] = true;
      }
      // enable a single re-sync in 8 hours
      clearTimeout(timeoutID);
      timeoutID = setTimeout(syncSupportedPaperIDs, 2.88e7);
    }
  } catch (error) {
    console.error(error);
  } finally {
    alreadySyncing = false;
  }
}

// download the supported paper IDs and resync every 8 hours
syncSupportedPaperIDs();
