const path = require('path');
const fs = require('fs');

module.exports = function mock(req, res) {
    const reqPath = req.path.slice(1);
    const jsonPath = path.resolve(__dirname, '../src', `${reqPath}.json`);
    console.log(`[** mocks **]: use ${jsonPath}`);
    try {
        // TODO require有缓存，在运行过程中修改json不会生效，需要重启dev server
        // TODO fs.readFileSync
        // const json = require(jsonPath);
        const json = fs.readFileSync(jsonPath).toString();
        res.json(JSON.parse(json));
    } catch (e) {
        if (e.message && e.message.indexOf('no such file or directory') > -1) {
            console.log('Mock json file not found');
            // res.json(JSON.stringify({}));
            res.status(404).end(`Mock json file not found: ${jsonPath}`);
            return;
        }
        throw e;
    }
};
