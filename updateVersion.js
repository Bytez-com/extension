const {
  promises: { writeFile }
} = require("fs");
// eslint-disable-next-line import/no-extraneous-dependencies
const { zip } = require("zip-a-folder");

function save(fileName, obj, newVersion) {
  obj.version = newVersion;
  return writeFile(`${__dirname}/${fileName}`, JSON.stringify(obj, 0, 2));
}

(async () => {
  const semanticVersion = { major: 0, minor: 1, patch: 2 };
  const packageJSON = require("./package.json");
  let currentVersion = packageJSON.version.split(".").map(element => +element);

  const update = semanticVersion[process.argv[3]];

  switch (update) {
    case 0: {
      currentVersion = [++currentVersion[update], 0, 0];
      break;
    }
    case 1: {
      currentVersion = [currentVersion[0], ++currentVersion[update], 0];
      break;
    }
    case 2: {
      ++currentVersion[update];
      break;
    }
    default: {
      return console.log(`v-${currentVersion.join(".")}`);
    }
  }

  const newVersion = currentVersion.join(".");

  await Promise.all([
    save("package.json", packageJSON, newVersion),
    save("public/manifest.json", require("./public/manifest.json"), newVersion),
    save("build/manifest.json", require("./build/manifest.json"), newVersion)
  ]);
  await zip(`${__dirname}/build`, `${__dirname}/build.zip`);
})();
