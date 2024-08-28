import { execSync } from "child_process";
import type { Command } from "commander";
import fs from "fs";
import readLine from "readline-sync";
import { ALIASES_PATH } from "../../../utils/envs";


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

                execSync(`sed -i '/^$/d' ${ALIASES_PATH}`)
                if (aliasesContent.includes(`alias ${name}`) && !preview) {
                    !readLine.keyInYN('This alias already exists. Do you want to update?') && app.exitOverride()
                    execSync(`sed -i '/^alias ${name}=/d' ${ALIASES_PATH}`)
                }

                !lastLineIsBlank && fs.appendFileSync(ALIASES_PATH, "\n")
                !preview && fs.appendFileSync(ALIASES_PATH, alias)
                execSync(alias)
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })

}