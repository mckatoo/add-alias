#! /usr/bin/env bun

import { Command } from "commander";
import addAlias from "src/commands/add-alias";
import listAlias from "src/commands/list-alias";
import rmAlias from "src/commands/rm-alias";
import { RC_FILE } from "src/utils/envs";
import rcFilePrepare from "src/utils/shell-rc-prepare";
import packageInfo from "./package.json";


rcFilePrepare()

const app = new Command()

app
  .name('aliases')
  .description(`CLI add alias on ${RC_FILE}`)
  .version(packageInfo.version)

addAlias(app)
listAlias(app)
rmAlias(app)

app.parse()