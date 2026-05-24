import { createGlobPatternsForDependencies } from "@nx/react/tailwind";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('@tailwindcss/postcss').Config} */
export default {
    content: [
        join(
            __dirname,
            "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
        ),
        ...createGlobPatternsForDependencies(__dirname)
    ],
    theme: {
        extend: {
            colors: {
                "basic-black": "#101010",
                "basic-white": "#EEF0F6",
                "basic-green": "#29B54C",
                "basic-red": "#FF323F",
                "basic-yellow": "#FFC652",
                "basic-gray": "#818D99",
                "basic-gray-light": "#dbdee8",
                "basic-border-gray": "#EEF0F629",
                "basic-blue": "#41B0FF",
                "basic-green-light": "#00AF4D1F",
                "basic-green-dark": "#25A044",
                "basic-green-deep": "#004E3A"
            }
        }
    },
    plugins: []
};
