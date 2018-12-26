#!/usr/bin/env node
const program = require('commander')
const cmds    = require('./cmds')

program
  .version('0.0.1')

program
  .command('config <config>')
  .option('-i, --id <id>', 'specifies the application id. Ex.: br.com.example.app')
  .option('-n, --name <name>', 'specifies the application name. Ex.: My App')
  .option('-v, --appv <appv>', 'specifies the application version. Ex.: 0.0.1')
  .option('-o, --out [out]', 'specifies the name of out xml file.')
  .action((c, options) => cmds.config(c, options))


program.parse(process.argv)
  