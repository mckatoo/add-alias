import { describe, expect, spyOn, mock, test, jest } from "bun:test";
import { Command } from "commander";
import addAlias from ".";
import fs from "fs";
import child_process from "child_process"


describe("Add alias", () => {
    test("when arguments includes -- then stop processing options", () => {
        const readFileSyncSpy = spyOn(fs, 'readFileSync')
        readFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(''))
        const appendFileSyncSpy = spyOn(fs, 'appendFileSync')
        appendFileSyncSpy.mockImplementation(jest.fn().mockReturnValue(null))
        const execSyncSpy = spyOn(child_process, 'execSync')
        execSyncSpy.mockImplementation(jest.fn().mockReturnValue(null))

        const app = new Command("aliases");
        addAlias(app)
        app.parse(["node", "aliases", "add", "-n l", "-c ls", "--", "--type", "order-cake"]);
        const opts = app.commands[0].opts()
        const args = app.commands[0].args
        const name = opts.name.replace(" ", "")

        expect(name).toBe("l");
        expect(opts.type).toBeUndefined();
        expect(args).toEqual(["--type", "order-cake"]);
    });

    // test("unknown option, then handle error", () => {
    //     const program = new Command();
    //     program
    //         .exitOverride()
    //         .command("order-cake")
    //         .action(() => { });
    //     let caughtErr: any;
    //     try {
    //         program.parse(["node", "palatial-cakes-cli", "order-cake", "--color"]);
    //     } catch (err) {
    //         caughtErr = err;
    //     }
    //     expect(caughtErr.code).toBe("commander.unknownOption");
    // });

    // test("unknown command, then handle error", () => {
    //     const program = new Command();
    //     program
    //         .exitOverride()
    //         .command("order-cake")
    //         .action(() => { });
    //     let caughtErr: any;
    //     try {
    //         program.parse(["node", "palatial-cakes-cli", "make-order"]);
    //     } catch (err) {
    //         caughtErr = err;
    //     }
    //     expect(caughtErr.code).toBe("commander.unknownCommand");
    // });
})