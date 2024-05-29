// We want to make an @inquirer/prompts version of the `inquirer-press-to-continue` package
import chalk from "chalk";
import { createPrompt, useKeypress, useState, isEnterKey, usePrefix, useEffect, useMemo } from "@inquirer/core";
import ora from "ora";

export type WaitPressConfig = {
    message?: string;
};

export const waitPress = createPrompt<null, WaitPressConfig>(
    (config, done) => {
        const spinner = useMemo(() => {
            return ora({
                text: config.message || "Press enter to continue",
                spinner: "dots",
                color: "cyan"
            }).start();
        }, []);

        useKeypress((key) => {
            if (isEnterKey(key)) {
                spinner.stop();
                done(null);
            }
        });

        return '\r';
    }
);