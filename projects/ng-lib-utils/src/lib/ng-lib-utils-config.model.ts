export interface NgLibUtilsConfig {
  projectName: string;
  srcParentFolder: string;
  destParentFolder?: string;
  uglifyOptions?: NgLibUtilsUglifyOptions;
}

export interface NgLibUtilsUglifyOptions {
  ecma?: string;
  isModule?: boolean;
  sourceMap?: boolean;
  classes?: any;
  functions?: any;
  properties?: any;
  topLevel?: boolean;
  isLegacyAccessorsDefinition?: boolean;
}

