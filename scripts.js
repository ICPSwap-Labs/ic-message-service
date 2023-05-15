const shelljs = require("shelljs");

const argv = process.argv;

let isPro = false;

for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "build") {
    isPro = true;
    break;
  }
}

if (!isPro) {
  shelljs.exec("cp -R ./.dfx/local/canister_ids.json ./src/");
} else {
  shelljs.exec("cp -R ./canister_ids.json ./src/");
}
