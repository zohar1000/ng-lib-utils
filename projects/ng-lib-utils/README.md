ng-lib-utils is helpful when developing angular library, it provides common routines:
1. uglifying the library code
2. copy readme.md file from the root folder to the transpiled code folder
3. bumping the version
4. publish the package

## uglifying the library code
when you build your library, usually to the 'dist' folder, that code is not uglified.<br/>
uglifying the code means shortening variable/method names.<br/>

ng-lib-utils uses another package, ngx-uglifier, to uglify the code.<br/>
in order to get a meaningful uglification, your library code needs to be written to support it, please follow the
instructions on [ngx-uglifier](https://www.npmjs.com/package/ngx-uglifier) for that.

## copy readme.md file from the root folder to the transpiled code folder
Usually packages are uploaded to repository site (e.g. npmjs.com) and to a source control
site (e.g. github.com).<br/>
The readme.md file needs to be the same in both sites.<br/>
When you enable this option then the readme.md file from the root folder will be copied to
the folder of the transpiled code, overriding the existing one.

## bumping the version
The package version should be bumped every time you publish your package.<br/>
This package enables you to bump the version, it does so only for the minor version.<br/>
If you enable the option then the following will happen:
* the version is extracted from the package.json in the root folder
* the minor version is advanced in one
* the package.json file is updated
* the package.json file in the transpiled folder is updated with the bumped version

> note that if you bump the version then make sure to publish your library as well, otherwise the
> version in the package.json will be unnecessarily bumped.

## publish the package
if you enable this option then your library will be published.


# Installation

```angular2html
npm install -D ng-lib-utils
```

# Use

create a script in your root folder.<br/>

```angular2html
const NgLibUtils = require('ng-lib-utils');

const config = { projectName: 'my-lib' };
const ngLibUtils = new NgLibUtils(config);
ngLibUtils.init().then();
```

Run the script from the command line with arguments to enable the different options.<br/>
For example, if the script name is lib-utils.js then the line below enables all 4 options:

```angular2html
node ./lib-utils --uglify --copy-readme --bump-version --publish
```

After running this line:
* your code will be uglified
* the readme.md file will be copied
* the version number in package.json will be bumped
* your library will be published
<br/><br/>

#### config object interface
The config object has the interface of *NgxUglifierConfig* and is described at [ngx-uglifier](https://www.npmjs.com/package/ngx-uglifier).




