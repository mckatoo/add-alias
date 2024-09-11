import { execSync } from "child_process";
import type { Command } from "commander";
import fs from "fs";
import readLine from "readline-sync";
import clog, { ClogColor } from "src/utils/clog";
import { ALIASES_PATH, RELOAD_MESSAGE } from "src/utils/envs";


export default (app: Command) => {
    app.command('add')
        .description('add alias. Ex: aliases add -n ll -c "ls -l"')
        .requiredOption('-n, --name <string>', 'name of alias')
        .requiredOption('-c, --command <string>', 'command for said alias')
        .option('-p, --preview', 'if option is used the changes not be write on the .aliases file, but aliases is applied temporarily', false)
        .action(({ name, preview, command }) => {
            !name || !command && app.help()

            try {
                const alias = `alias ${name}="${command}"`
                const aliasesContent = fs.readFileSync(ALIASES_PATH).toLocaleString()
                const lines = aliasesContent.split('\n')
                const lastLine = lines[lines.length - 1]
                const lastLineIsBlank = lastLine == ""

                if (aliasesContent.includes(`alias ${name}=`) && !preview) {
                    const update = readLine.keyInYN('This alias already exists. Do you want to update?')
                    if (!update) process.exit()
                    execSync(`sed -i '/^alias ${name}=/d' ${ALIASES_PATH}`)
                }

                if (!preview) {
                    !lastLineIsBlank && fs.appendFileSync(ALIASES_PATH, "\n")
                    fs.appendFileSync(ALIASES_PATH, alias)
                }
                execSync(`sed -i '/^$/d' ${ALIASES_PATH}`)
                clog(
                    RELOAD_MESSAGE,
                    ClogColor.yellow
                )
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })

}