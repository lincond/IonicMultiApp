#!/usr/bin/env node
const program = require('commander')
const cmds    = require('./cmds')

program
  .version('0.0.1')

program
  .command('config <config>')
  .description('Build a new config.xml with provided data')
  .option('-i, --id <id>', 'specifies the application id. Ex.: br.com.example.app')
  .option('-n, --name <name>', 'specifies the application name. Ex.: My App')
  .option('-v, --appv <appv>', 'specifies the application version. Ex.: 0.0.1')
  .option('-o, --out [out]', 'specifies the name of out xml file.')
  .action((c, options) => cmds.config(c, options))

program
  .command('resources')
  .alias('res')
  .description('Generate new resources with provided images paths')
  .option('-s, --splash <splash_path>', 'specifies the splash.png path')
  .option('-i, --icon <icon_path>', 'specifies the icon.png path')
  .action((options) => cmds.resources(options))

program.parse(process.argv)
  