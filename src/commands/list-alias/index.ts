import type { Command } from "commander";
import fs from "fs";
import { ALIASES_PATH } from "src/utils/envs";


export default (app: Command) => {
    app.command('list')
        .description('list all alias. Ex: aliases list')
        .action(() => {
            try {
                const aliasesContent = fs.readFileSync(ALIASES_PATH).toLocaleString().replaceAll('alias ', '')
                console.log(aliasesContent)
            } catch (error) {
                error instanceof Error && app.error(error.message)
            }
        })
}