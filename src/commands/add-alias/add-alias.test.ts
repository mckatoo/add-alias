import { afterEach, beforeEach, describe, expect, jest, mock, spyOn, test } from "bun:test";
import child_process from "child_process";
import { Command } from "commander";
import fs from "fs";
import { ALIASES_PATH } from "src/utils/envs";
import addAlias from ".";
import readLine from "readline-sync";


let readFileSyncSpy: any
let appendFileSyncSpy: any
let execSyncSpy: any
let keyInYNSpy: any

describe("Add alias", () => {
    beforeEach(() => {
        readFileSyncSpy = spyOn(fs, 'readFileSync')
        appendFileSyncSpy = spyOn(fs, 'appendFileSync')
        execSyncSpy = spyOn(child_process, 'execSync')
        keyInYNSpy = spyOn(readLine, 'keyInYN')

        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(''))
        appendFileSyncSpy.mockImplementation(jest.fn())
        execSyncSpy.mockImplementation(jest.fn())
    })

    afterEach(() => {
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
        addAlias(program)

        let caughtErr: any;
        try {
            program.parse(["node", "aliases", "add", "-n l", "-c exa", "--color"]);
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

    test("Success on add alias", () => {
        const program = new Command();
        program.exitOverride()
        addAlias(program)
        program.parse(["node", "aliases", "add", "-n l", "-c exa -l"]);
        const alias = "alias  l=\" exa -l\""
        const opts = program.commands[0].opts()
        const name = opts.name.replace(" ", "")
        const command = opts.command.replace(" ", "")

        expect(name).toBe('l')
        expect(command).toBe('exa -l')
        expect(appendFileSyncSpy).toHaveBeenLastCalledWith(ALIASES_PATH, alias)
        expect(execSyncSpy).toHaveBeenCalledWith(`sed -i '/^$/d' ${ALIASES_PATH}`)
    })

    test("Success on update alias", () => {
        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue('alias  l=\" exa -l\"'))
        keyInYNSpy.mockImplementation(jest.fn().mockReturnValue(true))

        const program = new Command();
        program.exitOverride()
        addAlias(program)
        program.parse(["node", "aliases", "add", "-n l", "-c exa -l"]);

        const alias = 'alias  l=\" exa -l\"'
        const opts = program.commands[0].opts()
        const name = opts.name.replace(" ", "")
        const command = opts.command.replace(" ", "")

        expect(name).toBe('l')
        expect(command).toBe('exa -l')
        expect(appendFileSyncSpy).toHaveBeenLastCalledWith(ALIASES_PATH, alias)
        expect(execSyncSpy).toHaveBeenNthCalledWith(1, `sed -i '/^alias  ${name}=/d' ${ALIASES_PATH}`)
        expect(execSyncSpy).toHaveBeenLastCalledWith(`sed -i '/^$/d' ${ALIASES_PATH}`)
    })
})