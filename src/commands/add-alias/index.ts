import chalk from "chalk";
import child_process from "child_process";
import type { Command } from "commander";
import fs from "fs";
import readLine from "readline-sync";
import { ALIASES_PATH, RELOAD_MESSAGE } from "src/utils/envs";


export default (app: Command) => {
    app.command('add')
        .description('add alias. Ex: aliases add -n ll -c "ls -l"')
        .requiredOption('-n, --name <string>', 'name of alias')
        .requiredOption('-c, --command <string>', 'command for said alias')
        .action(({ name, command }) => {
            !name || !command && app.help()

            try {
                const alias = `alias ${name}="${command}"`
                const aliasesContent = fs.readFileSync(ALIASES_PATH).toLocaleString()
                const lines = aliasesContent.split('\n')
                const lastLine = lines[lines.length - 1]
                const lastLineIsBlank = lastLine == ""

                if (aliasesContent.includes(`alias ${name}=`)) {
                    const update = readLine.keyInYN('This alias already exists. Do you want to update?')
                    if (!update) process.exit()
                    child_process.execSync(`sed -i '/^alias ${name}=/d' ${ALIASES_PATH}`)
                }

                !lastLineIsBlank && fs.appendFileSync(ALIASES_PATH, "\n")
                fs.appendFileSync(ALIASES_PATH, alias)
                child_process.execSync(`sed -i '/^$/d' ${ALIASES_PATH}`)
                console.log(`${chalk.yellow(`${RELOAD_MESSAGE} or execute ${chalk.underline('reload_aliases')} command.`)}`)
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })

}