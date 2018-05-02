const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const prettier = require('prettier');
const prettierBaseConfig = {
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    bracketSpacing: true
};
const prettierJsonConfig = Object.assign({}, prettierBaseConfig, {
    parser: 'json'
});
const prettierJsConfig = Object.assign({}, prettierBaseConfig, {
    parser: 'typescript'
});
const prettierCssConfig = Object.assign({}, prettierBaseConfig, {
    parser: 'css'
});

const PAGES_ROOT = path.resolve(process.cwd(), 'src/pages');

const isTsProject = fs.existsSync(path.resolve(process.cwd(), 'src/main.ts'));

function promptForPage() {
    const pages = fs.readdirSync(PAGES_ROOT).map(page => page.toLowerCase());
    const question = {
        type: 'input',
        name: 'page',
        message: '输入要新建的page',
        default: '',
        validate(input) {
            return new Promise((resolve, reject) => {
                input = String.prototype.toLowerCase.call(input);
                if (!input) {
                    reject(new Error('请输入Page的名称'));
                } else if (pages.includes(input)) {
                    reject(new Error('该Page已存在'));
                } else if (!/^[a-z]+$/i.test(input)) {
                    reject(new Error('Page的名称必须为a-z组成'));
                }
                resolve(true);
            });
        }
    };

    return inquirer
        .prompt(question)
        .then(answer => String.prototype.toLowerCase.call(answer.page));
}

function addPage(page) {
    const pageFolder = path.resolve(PAGES_ROOT, page);
    fs.mkdirSync(pageFolder);
    // style
    const less = `.wrapper {position: relative;}`;
    fs.writeFileSync(
        path.resolve(pageFolder, 'index.less'),
        prettier.format(less, prettierCssConfig)
    );
    // main.js/ts
    if (!isTsProject) {
        const mainJs = `import Page from './index';
        import { WrapPage } from 'common-mpvue';
        
        new WrapPage(Page);
        
        export default {
            config: {
                backgroundTextStyle: 'black',
                navigationBarBackgroundColor: '#ffffff',
                navigationBarTitleText: '页面标题',
                navigationBarTextStyle: 'black'
            }
        };
        `;
        fs.writeFileSync(
            path.resolve(pageFolder, 'main.js'),
            prettier.format(mainJs, prettierJsConfig)
        );
    } else {
        const mainJs = `import Page from "./index.vue";
        import { WrapPage } from "common-mpvue";
        
        /* tslint:disable */
        new WrapPage(Page);
        /* tslint:enable */
        
        export default {
            config: {
                backgroundTextStyle: "black",
                navigationBarBackgroundColor: "#ffffff",
                navigationBarTitleText: "页面标题",
                navigationBarTextStyle: "black"
            }
        };        
        `;
        fs.writeFileSync(
            path.resolve(pageFolder, 'main.ts'),
            prettier.format(mainJs, prettierJsConfig)
        );
    }
    // index.vue
    let vue;
    if (!isTsProject) {
        vue = `<template>
    <div class="wrapper">
        页面${page}
    </div>
</template>

<script>
export default {
    name: '${page}',
    components: {},
    data() {
        return {};
    },
    computed: {},
    onLoad() {},
    onShow() {},
    onReady() {},
    onUnload() {}
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
      `;
    } else {
        vue = `<template>
    <div class="wrapper">
        页面${page}
    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="less" scoped>
@import './index.less';
</style>
        `;
    }
    fs.writeFileSync(path.resolve(pageFolder, 'index.vue'), vue);

    // index.ts
    if (isTsProject) {
        const className = page.split('').map((char, index) => {
            if (index === 0) {
                return char.toUpperCase();
            }
            return char.toLowerCase();
        }).join('');
        const tsScript = `import board from '@/components/board.vue';
        import { getApp, wx, wxp } from 'common-mpvue';
        import { Component } from 'vue-property-decorator';
        import Vue from 'vue';
        
        @Component({
            components: {
                board
            }
        })
        export default class ${className} extends Vue {
            // props
            text: string = '';
        
            // computed: 
            get upperText() {
                return this.text.toUpperCase()
            }
        
            // method
            updateText(text: string) {
                this.text = text;
            }
        
            onLoad() {}
        
            onShow() {}
        
            onReady() {}
        
            onUnload() {}
        }
        `;
        fs.writeFileSync(
            path.resolve(pageFolder, 'index.ts'),
            prettier.format(tsScript, prettierJsConfig)
        );
    }
}

promptForPage().then(page => {
    addPage(page);
});
