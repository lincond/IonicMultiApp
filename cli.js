#!/usr/bin/env node
const program = require('commander')
const chalk   = require('chalk')
const gui     = require('./gui')

const log = console.log

program
  .version('0.0.1')
  .option('-i, --id <id>', 'specifies the application id. Ex.: br.com.example.app')
  .option('-n, --name <name>', 'specifies the application name. Ex.: My App')
  .option('-v, --appv <appv>', 'specifies the application version. Ex.: 0.0.1')
  .option('-o, --out [out]', 'specifies the name of out xml file.')
  .arguments('<config>')
  .action(async (config) => {
    if (!program.id || !program.name || !program.appv) {
      log(chalk.red('You must provide the config.xml and also app name, id and version to build'))
      program.outputHelp()
      process.exit(1)
    }

    const fs             = require('fs')
    const util           = require('util')
    const readFileAsync  = util.promisify(fs.readFile)
    const writeFileAsync = util.promisify(fs.writeFile)

    try {
      gui.log('Reading config.xml')
      let configFile = await readFileAsync(config)
      gui.log('Read complete')

      const xml = require('xml-js')
      gui.log('Parsing config.xml')
      let parsedConfig = xml.xml2js(configFile, { compact: true })
      
      if (!parsedConfig.widget)
        throw new Error('Invalid config.xml')

      gui.log('Parsing finished')
      let appName    = parsedConfig.widget.name._text,
          appVersion = parsedConfig.widget._attributes.version,
          appId      = parsedConfig.widget._attributes.id

      let confirmation = await gui.createConfirmationTable(
        [appId, appName, appVersion],
        [program.id, program.name, program.appv]
      )
      
      if (!confirmation) {
        log(chalk.red('Aborted! No file have been changed.'))
        process.exit(1)
      }

      parsedConfig.widget.name._text          = program.name
      parsedConfig.widget._attributes.version = program.appv
      parsedConfig.widget._attributes.id      = program.id

      const outConfig   = xml.js2xml(parsedConfig, {compact: true, spaces: 4})
      const outFileName = program.out || 'out.xml'
      
      gui.log(`writing ${outFileName}`)
      await writeFileAsync(outFileName, outConfig)
      gui.log('write complete')
      
      log('')
      log(chalk.green('Success!'))
      process.exit(0)
    } catch (error) {
      log(chalk.red("An error ocurred", error))
    }
  })
  .parse(process.argv)
