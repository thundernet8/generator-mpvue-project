module.exports = {
    'src/**/*.{js,vue}': ['lint-staged:format', 'lint-staged:script', 'git add']
};
