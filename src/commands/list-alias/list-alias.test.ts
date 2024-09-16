import { afterEach, beforeEach, describe, expect, jest, mock, spyOn, test } from "bun:test";
import { Command } from "commander";
import fs from "fs";
import { ALIASES_PATH } from "src/utils/envs";
import listAlias from ".";


let readFileSyncSpy: any

describe("List aliases", () => {
    beforeEach(() => {
        readFileSyncSpy = spyOn(fs, 'readFileSync')
        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(''))
    })

    afterEach(() => {
        mock.restore()
    })

    test("When arguments includes -- then stop processing options", () => {
        const app = new Command("aliases");
        app.exitOverride()
        listAlias(app)
        app.parse(["node", "aliases", "list", "--", "--type", "rm"]);
        const opts = app.commands[0].opts()
        const args = app.commands[0].args

        expect(opts.type).toBeUndefined();
        expect(args).toEqual(["--type", "rm"]);
    });

    test("Unknown option, then handle error", () => {
        const program = new Command();
        program.exitOverride()
        listAlias(program)

        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "list", "--color"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownOption");
    });

    test("Unknown command, then handle error", () => {
        const program = new Command();
        program.exitOverride()
        listAlias(program)
        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "add"]);
        } catch (err) {
            caughtErr = err;
        }
        expect(caughtErr.code).toBe("commander.unknownCommand");
    });

    test("Success on list alias", () => {
        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(Buffer.from('alias l="exa -l"')))
        const consoleLogSpy = spyOn(console, 'log')
        consoleLogSpy.mockImplementation(jest.fn().mockReturnValue('l="exa -l"'))
        
        const program = new Command();
        program.exitOverride()
        listAlias(program)
        program.parse(["node", "aliases", "list"]);

        expect(readFileSyncSpy).toBeCalledWith(ALIASES_PATH)
        expect(consoleLogSpy).toBeCalledWith('l="exa -l"')
    })
})