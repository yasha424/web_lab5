import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";

import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
dotenv.config();

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            );

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "public/build/bundle.js",
    },
    plugins: [
        replace({
            URI: JSON.stringify(process.env.URI),
            another_uri: JSON.stringify(process.env.another_uri),
            DOMAIN: JSON.stringify(process.env.DOMAIN),
            CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // ok :|
        }),

        svelte({
            compilerOptions: {
                dev: !production,
            },
        }),
        css({ output: "bundle.css" }),

        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),

        !production && serve(),

        !production && livereload("public"),

        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
