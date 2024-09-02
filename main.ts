import { Command } from "commander";
import packageInfo from "./package.json";
import addAlias from "./src/commands/add-alias";
import zshrcPrepare from "./utils/zshrc-prepare";
import listAlias from "./src/commands/list-alias";


const app = new Command()

zshrcPrepare(app)

app
  .name('aliases')
  .description('CLI add alias on .zshrc')
  .version(packageInfo.version)

addAlias(app)
listAlias(app)

app.parse()