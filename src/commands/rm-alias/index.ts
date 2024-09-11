import type { Command } from "commander";
import { execSync } from "child_process";
import { ALIASES_PATH } from "src/utils/envs";


export default (app: Command) => {
    app.command('rm')
        .description('remove alias by name. Ex: aliases rm l')
        .requiredOption('-n, --name <string>', 'name of alias')
        .option('-p, --preview', 'if option is used the changes not be write on the .aliases file, but aliases is applied temporarily', false)
        .action(({name, preview}) => {
            try {
                if(preview){
                    console.log(execSync(`sed '/alias ${name}=/d' ${ALIASES_PATH}`))
                } else {
                    execSync(`sed -i '/alias ${name}=/d' ${ALIASES_PATH}`)
                }
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })
}