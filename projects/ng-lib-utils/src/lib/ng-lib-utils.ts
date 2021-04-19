declare var require: any;
declare var process: any;
const { exec } = require('child_process');
const fsPromises = require('fs').promises;
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
    await this.verifyDestFolder();
    if (process.argv.includes('--uglify')) await this.uglify();
    if (process.argv.includes('--copy-readme')) await this.copyReadme();
    if (process.argv.includes('--bump-version')) await this.bumpVersion();
    if (process.argv.includes('--publish')) await this.publish();
  }

  async verifyDestFolder() {
    await this.ngxUglifier.verifyDirectory(this.config.destParentFolder);
    await this.ngxUglifier.verifyDirectory(this.destFolder);
  }

  async uglify() {
    await this.ngxUglifier.init();
    this.print(`${this.config.projectName} was uglified successfully`);
  }

  async copyReadme() {
    const fileText = await fsPromises.readFile('README.md', 'utf8');
    const destFolder = path.join(this.config.destParentFolder, this.config.projectName);
    await fsPromises.writeFile(path.join(destFolder, 'README.md'), fileText, 'utf8');
    this.print(`README.md file was successfully copied from root folder to ${destFolder}`);
  }

  async bumpVersion() {
    const updateVersion = async (filePath, version?) => {
      let fileText = await fsPromises.readFile(filePath, 'utf8');
      const fileJson = JSON.parse(fileText);
      if (!version) {
        const versionTokens = fileJson.version.split('.');
        versionTokens[2] = String(Number(versionTokens[2]) + 1);
        version = versionTokens.join('.');
      }
      fileJson.version = version;
      fileText = JSON.stringify(fileJson, null, 2);
      await fsPromises.writeFile(filePath, fileText, 'utf8');
      return version;
    };
    const newVersion = updateVersion('package.json');
    const destFolder = path.join(this.config.destParentFolder, this.config.projectName);
    await updateVersion(path.join(destFolder, 'package.json'), newVersion);
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
