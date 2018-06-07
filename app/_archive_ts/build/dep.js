// mpvue引用原生组件npm包解决方案

const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const resolve = require('resolve');
const mkdirp = require('mkdirp');
const replaceExt = require('replace-ext');
const lessCompiler = require('less');

// 从src的main.js通过ast分析usingComponents

function parseMainJS() {
    const code = fs.readFileSync(
        path.resolve(__dirname, '../src/pages/index/main.js')
    );

    const result = babel.transform(code);

    // console.log(result);
    const ast = result.ast;
    const tokens = ast.tokens;

    let mark = false;
    const kvs = [];
    let blockStart = false;
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.value === 'usingComponents') {
            mark = true;
        } else if (!mark) {
            continue;
        }
        if (token.type.label === '{') {
            blockStart = true;
        } else if (blockStart) {
            if (token.type.label === '}') {
                break;
            } else if (token.value) {
                kvs.push(token.value);
            }
        }
    }

    const components = kvs.reduce((prev, curr, index) => {
        if (index % 2 === 0) {
            prev.push({
                [curr]: kvs[index + 1]
            });
        }
        return prev;
    }, []);

    console.log(components);

    const json = {};
    components.forEach(c => {
        const key = Object.keys(c)[0];
        json[key] = c[key];
    });

    console.log(json);

    // fs.writeFileSync(path.resolve(__dirname, 'src/dep.js'), '')
    // fs.writeFileSync(path.resolve(__dirname, 'src/dep.json'), JSON.stringify(json))

    const dependencyComponentPackages = components.map(
        x => x[Object.keys(x)[0]]
    );

    console.log('dependencyComponentPackages', dependencyComponentPackages);
}

// Utils
const Utils = {
    isRelativePath(p) {
        return p.match(/^\.?\.\//);
    },

    ensureRelativePath(p) {
        let np = replaceExt(p, '');
        if (!np.startsWith('.')) {
            return `./${np}`;
        }
        return np;
    }
};

// 依赖管理解决
class DepManager {
    constructor(options = {}) {
        this.options = Object.assign(
            {
                projectPath: path.resolve(process.cwd()),
                distFolder: 'dist',
                pkgFolder: 'npm',
                debug: true
            },
            options
        );
        // 防止重复解析文件，以及可能带来的循环引用死循环
        this.cacheFiles = [];
    }

    transformCode(filePath) {
        if (this.cacheFiles.indexOf(filePath) > -1) {
            return;
        }
        this.cacheFiles.push(filePath);
        const result = babel.transformFileSync(filePath, {
            babelrc: false,
            plugins: [
                ['transform-object-rest-spread'],
                [
                    'module-resolver',
                    {
                        resolvePath: (dependency, currentFile) => {
                            return this.addDependency(dependency, filePath);
                        }
                    }
                ]
            ]
        });

        const outputPath = filePath.replace(
            'node_modules',
            `${this.options.distFolder}/${this.options.pkgFolder}`
        );

        this.safeWriteFile(outputPath, result.code);

        //component json
        const jsonFile = replaceExt(filePath, '.json');
        if (fs.existsSync(jsonFile)) {
            const json = require(jsonFile);
            if (json.component) {
                try {
                    this.safeWriteFile(
                        replaceExt(outputPath, '.wxml'),
                        fs
                            .readFileSync(replaceExt(filePath, '.wxml'))
                            .toString()
                    );
                    const wxssFilePath = replaceExt(filePath, '.wxss');
                    if (fs.existsSync(wxssFilePath)) {
                        this.safeWriteFile(
                            replaceExt(outputPath, '.wxss'),
                            fs.readFileSync(wxssFilePath).toString()
                        );
                    }

                    const lessFilePath = replaceExt(filePath, '.less');
                    if (fs.existsSync(lessFilePath)) {
                        lessCompiler
                            .render(fs.readFileSync(lessFilePath).toString())
                            .then(output => {
                                this.safeWriteFile(
                                    replaceExt(outputPath, '.wxss'),
                                    output.css
                                );
                            });
                    }
                } catch (err) {
                    // ignore
                    console.log(err);
                }
                if (
                    json.usingComponents &&
                    Object.keys(json.usingComponents).length > 0
                ) {
                    Object.keys(json.usingComponents).forEach(key => {
                        json.usingComponents[key] = this.addDependency(
                            json.usingComponents[key],
                            jsonFile
                        );
                    });
                }
                fs.writeFileSync(
                    replaceExt(outputPath, '.json'),
                    JSON.stringify(json, undefined, 4)
                );
            }
        }
    }

    addDependency(dependencyPath, currentFilePath) {
        if (this.options.debug) {
            console.log(
                `Add dependency: dependency ${dependencyPath}, current file ${currentFilePath}`
            );
        }
        const projectPath = path.resolve(process.cwd());
        const npmDir = path.resolve(projectPath, 'node_modules');
        const newNpmDir = path.resolve(
            projectPath,
            `src/${this.options.pkgFolder}`
        );
        const npmDistDir = path.resolve(
            projectPath,
            `${this.options.distFolder}/${this.options.pkgFolder}`
        );

        // 当前文件路径确保为绝对路径
        let currentFileIsSource; // 当前文件是项目源码还是npm包的文件
        if (Utils.isRelativePath(currentFilePath)) {
            currentFileIsSource = true;
            currentFilePath = path.resolve(projectPath, currentFilePath);
        } else {
            if (
                currentFilePath.startsWith('/') &&
                currentFilePath.indexOf('node_modules') === -1
            ) {
                currentFileIsSource = true;
            } else {
                currentFileIsSource = false;
                currentFilePath = path.resolve(npmDir, currentFilePath);
            }
        }

        let dependencyRelativePath = dependencyPath;
        let dependencyAbsPath = dependencyPath;
        let inputFilePath;
        const currentFileDir = path.dirname(currentFilePath);

        if (Utils.isRelativePath(dependencyPath)) {
            // 如果依赖是相对路径，则引用路径保持不变，仅仅复制文件
            dependencyAbsPath = path.resolve(currentFileDir, dependencyPath);
            inputFilePath = resolve.sync(dependencyAbsPath);
            dependencyRelativePath = path.relative(
                currentFileDir,
                inputFilePath
            );
        } else {
            // 如果依赖是绝对路径，则认为是一个npm包
            dependencyAbsPath = path.resolve(npmDir, dependencyPath);
            const dependencyEntryAbsPath = resolve.sync(dependencyAbsPath);
            const dependencyDistAbsPath = path.resolve(
                npmDistDir,
                dependencyPath
            );

            inputFilePath = resolve.sync(dependencyPath);
            if (!currentFileIsSource) {
                dependencyRelativePath = path.relative(
                    currentFileDir,
                    resolve.sync(path.resolve(npmDir, dependencyPath))
                );
            } else {
                dependencyRelativePath = path.relative(
                    currentFileDir,
                    dependencyDistAbsPath +
                        dependencyEntryAbsPath.slice(dependencyAbsPath.length)
                );
            }
        }

        this.transformCode(inputFilePath);

        return Utils.ensureRelativePath(dependencyRelativePath);
    }

    safeWriteFile(outputPath, code) {
        if (this.options.debug) {
            console.log('Write file:', outputPath);
        }
        mkdirp.sync(path.dirname(outputPath));
        fs.writeFileSync(outputPath, code);
    }

    scanDeps() {
        const pages = fs
            .readdirSync(path.resolve(__dirname, '../src/pages'))
            .filter(p => !p.startsWith('.'));
        pages.forEach(p => {
            this.handlePageDeps(p);
        });
    }

    handlePageDeps(page) {
        const jsonFilePath = path.resolve(
            __dirname,
            `../${this.options.distFolder}/pages/${page}/${page}.json`
        );

        if (fs.existsSync(jsonFilePath)) {
            const json = require(jsonFilePath);
            if (
                json.usingComponents &&
                Object.keys(json.usingComponents).length > 0
            ) {
                Object.keys(json.usingComponents).forEach(key => {
                    // 如果是个相对路径的component引入则忽略，因为不太可能在mpvue项目源码中写原生component
                    if (!Utils.isRelativePath(json.usingComponents[key])) {
                        json.usingComponents[key] = this.addDependency(
                            json.usingComponents[key],
                            jsonFilePath
                        );
                    }
                });
            }
            this.safeWriteFile(
                jsonFilePath,
                JSON.stringify(json, undefined, 4)
            );
        }
    }
}

const depManager = new DepManager({
    debug: false
});
// depManager.scanDeps();
module.exports = depManager;
