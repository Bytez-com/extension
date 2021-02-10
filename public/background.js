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
// check if extension is enabled; if so, enable or disable sync
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
// is the arxiv paper ID white listed to be opened
function checkIfWhiteListed(url) {
  if (extensionEnabled) {
    const [paperID] = extractPaperID(url);

    if (whiteList[paperID]) {
      return paperID;
    }
  }
}
// only allow one sync to be active
async function syncSupportedPaperIDs(retry = true) {
  try {
    if (alreadySyncing === false) {
      alreadySyncing = true;

      const response = await fetch("https://api.bytez.com/papers");
      const listOfPaperIDs = await response.json();

      if (listOfPaperIDs?.length) {
        setWhiteList(listOfPaperIDs);
      } else if (retry) {
        syncSupportedPaperIDs(false);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    alreadySyncing = false;
    // enable a single re-sync in 8 hours
    clearTimeout(timeoutID);
    timeoutID = setTimeout(syncSupportedPaperIDs, 2.88e7);
  }
}
function setWhiteList(listOfPaperIDs = []) {
  // reset the supported object
  whiteList = {};
  // set each paperID to true
  for (const paperID of listOfPaperIDs) {
    whiteList[paperID] = true;
  }
  // cache the list of paper IDs
  localStorage.listOfPaperIDs = JSON.stringify(listOfPaperIDs);
}
// download the supported paper IDs and resync every 8 hours
syncSupportedPaperIDs();
// check if this is the first time the user has installed the extension
chrome.storage?.sync.get("onboarded", ({ onboarded }) => {
  if (onboarded === undefined) {
    chrome.tabs.create({ url: "https://bytez.com/welcome" });
    chrome.storage?.sync.set({ onboarded: true });
  }
});
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) =>
  sendResponse(true)
);
// reload whitelist from cache
setWhiteList(
  localStorage.listOfPaperIDs && JSON.parse(localStorage.listOfPaperIDs)
);
