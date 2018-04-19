// http://eslint.org/docs/user-guide/configuring

module.exports = {
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: ['@gfe/eslint-config'],
    // add your custom rules here
    rules: {
        // allow paren-less arrow functions
        // 'arrow-parens': 0,
        // allow async-await
        // 'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        // semi: [2, 'always'],

        'wrap-iife': 0,

        // 'space-before-function-paren': 0,
        'vue/mustache-interpolation-spacing': 0,
        indent: [
            0,
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1
                }
            }
        ]
    },
    globals: {
        App: true,
        Page: true,
        wx: true,
        getApp: true,
        getPage: true,
        getCurrentPages: true
    }
};
