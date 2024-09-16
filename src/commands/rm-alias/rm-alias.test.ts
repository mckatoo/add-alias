import { afterEach, beforeEach, describe, expect, jest, mock, spyOn, test } from "bun:test";
import child_process from "child_process";
import { Command } from "commander";
import { ALIASES_PATH } from "src/utils/envs";
import rmAlias from ".";


let execSyncSpy: any

describe("Remove alias", () => {
    beforeEach(() => {
        execSyncSpy = spyOn(child_process, 'execSync')
        execSyncSpy.mockImplementation(jest.fn())
    })

    afterEach(() => {
        mock.restore()
    })

    test("When arguments includes -- then stop processing options", () => {
        const app = new Command("aliases");
        app.exitOverride()
        rmAlias(app)
        app.parse(["node", "aliases", "rm", "-n l", "--", "--type", "list"]);
        const opts = app.commands[0].opts()
        const args = app.commands[0].args
        const name = opts.name.replace(" ", "")

        expect(name).toBe("l");
        expect(opts.type).toBeUndefined();
        expect(args).toEqual(["--type", "list"]);
    });

    test("Unknown option, then handle error", () => {
        const program = new Command();
        program.exitOverride()
        rmAlias(program)

        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "rm", "-n l", "--color"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownOption");
    });

    test("Unknown command, then handle error", () => {
        const program = new Command();
        program.exitOverride()
        rmAlias(program)
        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "list"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownCommand");
    });

    test("Success on remove alias", () => {
        const program = new Command();
        program.exitOverride()
        rmAlias(program)
        program.parse(["node", "aliases", "rm", "-n l"]);
        const opts = program.commands[0].opts()
        const name = opts.name

        expect(name).toBe(' l')
        expect(execSyncSpy).toHaveBeenCalledWith(`sed -i '/alias ${name}=/d' ${ALIASES_PATH}`)
    })
})