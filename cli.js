#!/usr/bin/env node
const program = require('commander')
const chalk   = require('chalk')

const log = console.log

program
  .version('0.0.1')
  .option('-i, --id <id>', 'specifies the application id. Ex.: br.com.example.app')
  .option('-n, --name <name>', 'specifies the application name. Ex.: My App')
  .option('-v, --appv <appv>', 'specifies the application version. Ex.: 0.0.1')
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
      let configFile = await readFileAsync(config)

      const xml          = require('xml-js')
      let   parsedConfig = xml.xml2js(configFile, { compact: true })
      
      if (!parsedConfig.widget)
        throw new Error('Invalid config.xml')

      let appName    = parsedConfig.widget.name._text,
          appVersion = parsedConfig.widget._attributes.version,
          appId      = parsedConfig.widget._attributes.id
      
      log(chalk.blue(`Actual config.xml app:`))
      log(`App name: ${appName}`)
      log(`App version: ${appVersion}`)
      log(`App Id: ${appId}`)

      parsedConfig.widget.name._text          = program.name
      parsedConfig.widget._attributes.version = program.appv
      parsedConfig.widget._attributes.id      = program.id

      log('')

      log(chalk.blue(`New config.xml app:`))
      log(`App name: ${parsedConfig.widget.name._text}`)
      log(`App version: ${parsedConfig.widget._attributes.version}`)
      log(`App Id: ${parsedConfig.widget._attributes.id}`)

      const outConfig = xml.js2xml(parsedConfig, {compact: true, spaces: 4})
      await writeFileAsync('out.xml', outConfig)
      log(chalk.green('Success!'))
    } catch (error) {
      log(chalk.red("An error ocurred", error))
    }
  })
  .parse(process.argv)
