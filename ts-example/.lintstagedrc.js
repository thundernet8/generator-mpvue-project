module.exports = {
    'src/**/*.{ts,tsx}': ['lint-staged:format', 'lint-staged:ts', 'git add'],
    'src/**/*.{js,vue}': ['lint-staged:format', 'lint-staged:js', 'git add']
};
