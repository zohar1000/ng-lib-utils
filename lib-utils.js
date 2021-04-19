const NgLibUtils = require('./dist/ng-lib-utils/bundles/ng-lib-utils.umd');

const config = { projectName: 'ng-cond', destParentFolder: 'out', uglifyOptions: { sourceMap: true } }
const ngLibUtils = new NgLibUtils.NgLibUtils(config);
ngLibUtils.init().then();
