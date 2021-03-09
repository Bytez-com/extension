// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require("node-fetch");
const {
  promises: { writeFile }
} = require("fs");

fetch("https://api.bytez.com/papers")
  .then(res => res.json())
  .then(list => console.log(list.length.toLocaleString()) || list)
  .then(list =>
    writeFile(
      `${__dirname}/public/rules.json`,
      JSON.stringify(
        list.map((paperID, index) => ({
          id: index + 1,
          priority: 2147483646,
          action: {
            type: "redirect",
            redirect: {
              url: `https://bytez.com/read/arxiv/${paperID}`
            }
          },
          condition: {
            isUrlFilterCaseSensitive: false,
            urlFilter: `*://arxiv.org/pdf/${paperID}`,
            resourceTypes: ["main_frame"]
          }
        })),
        undefined,
        2
      )
    )
  );
