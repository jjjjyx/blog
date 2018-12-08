module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-parsing-error': 'off',
        // indent 4 spaces
        'indent': ['error', 4, {'SwitchCase': 1}]
    },
    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
                "indent": "off"
            }
        }
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    'globals': {
        '_': true,
        'SITE': true,
        'config': true,
    }
}
