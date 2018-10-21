
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": ["eslint:recommended", "google", "eslint-config-prettier"],
    "parserOptions": {
        "ecmaVersion": 2018,
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "prettier/prettier": ["error", {
            "singleQuote": true, "parser": "flow",
            'bracketSpacing': false, 'tabWidth': 4,
            'arrowParens':'always','bracketSpacing':false,
            'trailingComma':'none'


        }],
        "camelcase": "off",
        "no-console": "off",
        "new-cap": ["error", { "capIsNewExceptions": ["Router"] }],


        "guard-for-in": "off",
        "no-case-declarations": "off",
        "max-len": [
            "warn",
            { "code": 80 }
        ],


    },
    "plugins": ["prettier"]

};
