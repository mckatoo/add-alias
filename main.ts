import { Command } from "commander";
import fs from "fs";
import { BKP_DIR, NOW, ZSHRC_PATH } from "./utils/envs";
import packageInfo from "./package.json";
import addAlias from "./src/commands/add-alias";
import zshrcPrepare from "./utils/zshrc-prepare";


const app = new Command()

zshrcPrepare(app)

app
  .name('aliases')
  .description('CLI add alias on .zshrc')
  .version(packageInfo.version)

addAlias(app)

app.parse()