import child_process from "child_process";
import type { Command } from "commander";
import { ALIASES_PATH } from "src/utils/envs";


export default (app: Command) => {
    app.command('rm')
        .description('remove alias by name. Ex: aliases rm l')
        .requiredOption('-n, --name <string>', 'name of alias')
        .action(({ name }) => {
            try {
                child_process.execSync(`sed -i '/alias ${name}=/d' ${ALIASES_PATH}`)
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })
}