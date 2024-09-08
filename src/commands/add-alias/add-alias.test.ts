import { describe, expect, spyOn, mock, test, jest, afterAll, beforeAll } from "bun:test";
import { Command } from "commander";
import addAlias from ".";
import fs from "fs";
import child_process from "child_process"


describe("Add alias", () => {
    beforeAll(() => {
        const readFileSyncSpy = spyOn(fs, 'readFileSync')
        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(''))
        const appendFileSyncSpy = spyOn(fs, 'appendFileSync')
        appendFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(null))
        const execSyncSpy = spyOn(child_process, 'execSync')
        execSyncSpy.mockImplementation(jest.fn().mockReturnValue(null))
    })

    afterAll(() => {
        mock.restore()
    })

    test("When arguments includes -- then stop processing options", () => {
        const app = new Command("aliases");
        app.exitOverride()
        addAlias(app)
        app.parse(["node", "aliases", "add", "-n l", "-c ls", "--", "--type", "list"]);
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
        program
            .exitOverride()
            .command("add")
            .action(() => { });

        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "add", "--color"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownOption");
    });

    test("Unknown command, then handle error", () => {
        const program = new Command();
        program.exitOverride()
        addAlias(program)
        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "list"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownCommand");
    });
})