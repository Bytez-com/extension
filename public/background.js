/* eslint-disable max-len */
// Extension event listeners are a little different from the patterns
// you may have seen in DOM or Node.js APIs. The below event listener
//  registration can be broken into 4 distinct parts:
//
// * chrome      - the global namespace for Chrome's extension APIs
// * runtime     – the namespace of the specific API we want to use
// * onInstalled - the event we want to subscribe to
// * addListener - what we want to do with this event
//
// See https://developer.chrome.com/docs/extensions/reference/events/
//
// every 8 hours, update paper white list
// and add a 1-60 min extra wait time, so tabs dont updates dont collide
chrome.alarms.create({ periodInMinutes: 60 * 8 });
chrome.alarms.onAlarm.addListener(updateWhiteList);
// helpers to sync cache across tabs
// const storageGet = key =>
//   new Promise(resolve => chrome.storage.sync.get([key], resolve));
// const storageSet = obj =>
//   new Promise(resolve => chrome.storage.sync.get(obj, resolve));

// chrome.storage.sync.clear(console.log);
// allow only one "getWhiteList" request to occur a single re-sync in 8 hours
async function updateWhiteList() {
  try {
    // redownload the list of paper IDs that are white listed
    const [listOfPaperIDs, whiteList] = await Promise.all([
      fetch("https://api.bytez.com/papers").then(res => res.json()),
      fetch(chrome.runtime.getURL("rules.json"))
        .then(res => res.json())
        .then(
          json =>
            new Map(
              json.map(({ action: { redirect: { url } } }) => [
                url.slice(29),
                true
              ])
            )
        )
    ]);

    const newPaperIDsToWhiteList = listOfPaperIDs.filter(
      paperID => whiteList.has(paperID) === false
    );
    console.log(
      "Found",
      newPaperIDsToWhiteList.length,
      "new papers to white list",
      newPaperIDsToWhiteList
    );
    // and if it downloads correctly
    if (newPaperIDsToWhiteList.length) {
      const batches = [];

      for (let batch, i = 0, j = newPaperIDsToWhiteList.length; i < j; ) {
        batch = [];

        while (batch.length !== 8 && i < j) {
          batch.push(newPaperIDsToWhiteList[i++].replace(".", "\\."));
        }

        batches.push(batch.join("|"));
      }

      await Promise.all(batches.map(updateWhiteListRule));
    }
  } catch (error) {
    console.error(error);
  }
}
const updateWhiteListRule = (paperIDs, index) =>
  new Promise(resolve =>
    chrome.declarativeNetRequest.updateSessionRules(
      { removeRuleIds: [index + 1] },
      () =>
        chrome.declarativeNetRequest.updateSessionRules(
          {
            addRules: [
              {
                id: index + 1,
                priority: 2147483646,
                action: {
                  type: "redirect",
                  redirect: {
                    regexSubstitution: "bytez.com/read/arxiv/\\1"
                  }
                },
                condition: {
                  // eslint-disable-next-line no-useless-escape
                  regexFilter: `arxiv\\.org\/pdf\/(${paperIDs})`,
                  resourceTypes: ["main_frame"]
                }
              }
            ]
          },
          resolve
        )
    )
  );

updateWhiteList();
//
//
// allow bytez.com to know if the extension is installed
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    sendResponse(true);
  }
);
//
//
// if this is a new user, ask them to register
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({ url: "https://bytez.com/welcome" });
  }
});
