import { Command } from "commander"
import packageInfo from "./package.json"

const app = new Command()
app
  .name('add-alias')
  .description('CLI add alias on .zshrc')
  .version(packageInfo.version)
  .option('-n, --name <string>', 'name of alias')
  .option('-p, --preview', 'if option is used the changes not be write on the .zshrc file', false)

app.parse()


const flags = app.opts()
const preview = !!flags.preview
const name = flags.name



