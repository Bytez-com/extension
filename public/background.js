//
//
// every 8 hours, update paper white list
chrome.alarms.create({ periodInMinutes: 60 * 8 });
chrome.alarms.onAlarm.addListener(updateWhiteList);
//
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
      { newPaperIDsToWhiteList }
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
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.tabs.create({ url: "https://bytez.com/welcome" });
  }
});
