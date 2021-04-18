declare var require: any;
declare var process: any;
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
import { NgxUglifier, NgxUglifierConfig } from 'ngx-uglifier';

export class NgLibUtils {
  config: NgxUglifierConfig;
  destFolder;
  ngxUglifier: NgxUglifier;

  constructor(config: NgxUglifierConfig) {
    this.ngxUglifier = new NgxUglifier(config);
    this.config = config;
    this.destFolder = `${this.config.destParentFolder}/${this.config.projectName}`;
  }

  async init() {
    this.verifyDestFolder();
    if (process.argv.includes('--uglify')) await this.uglify();
    if (process.argv.includes('--copy-readme')) this.copyReadme();
    if (process.argv.includes('--bump-version')) this.bumpVersion();
    if (process.argv.includes('--publish')) await this.publish();
  }

  verifyDestFolder() {
    this.ngxUglifier.verifyDirectory(this.config.destParentFolder);
    this.ngxUglifier.verifyDirectory(this.destFolder);
  }

  async uglify() {
    await this.ngxUglifier.init();
    this.print(`${this.config.projectName} was uglified successfully`);
  }

  copyReadme() {
    const fileText = fs.readFileSync('README.md', 'utf8');
    const destFolder = path.join(this.config.destParentFolder, this.config.projectName);
    fs.writeFileSync(path.join(destFolder, 'README.md'), fileText, 'utf8');
    this.print(`README.md file was successfully copied from root folder to ${destFolder}`);
  }

  bumpVersion() {
    const updateVersion = (filePath, version?) => {
      let fileText = fs.readFileSync(filePath, 'utf8');
      const fileJson = JSON.parse(fileText);
      if (!version) {
        const versionTokens = fileJson.version.split('.');
        versionTokens[2] = String(Number(versionTokens[2]) + 1);
        version = versionTokens.join('.');
      }
      fileJson.version = version;
      fileText = JSON.stringify(fileJson, null, 2);
      fs.writeFileSync(filePath, fileText, 'utf8');
      return version;
    };
    const newVersion = updateVersion('package.json');
    const destFolder = path.join(this.config.destParentFolder, this.config.projectName);
    updateVersion(path.join(destFolder, 'package.json'), newVersion);
    this.print(`version in package.json files was successfully updated to ${newVersion} in root folder and ${destFolder} folder`);
  }

  publish() {
    return new Promise<void>((resolve) => {
      try {
        exec((process.platform === 'win32' ? 'npm.cmd' : 'npm') + ' publish', { cwd: this.destFolder }, (error, stdout, stderr) => {
          if (error) {
            console.log('Error publishing package, error:', error);
          } else if (stderr && (typeof stderr !== 'string' || stderr.indexOf('npm ERR!') !== -1)) {
            console.log('Error publishing package, stderr:', stderr);
          } else {
            this.print(`${this.config.projectName} was published successfully`);
          }
          resolve();
        });
      } catch (e) {
        console.log('Error publishing package:', e);
        resolve();
      }
    });
  }

  print(message) {
    console.log('ng-lib-utils:', message);
  }
}
