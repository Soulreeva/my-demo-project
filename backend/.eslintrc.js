module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        project: ["tsconfig.json"],
    },
    plugins: ["prettier", "@typescript-eslint/eslint-plugin"],
    extends: ["plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        "no-console": "warn",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-floating-promises": [
            "error",
            {
                ignoreIIFE: true,
            },
        ],
    },
};
