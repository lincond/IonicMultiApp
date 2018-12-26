const fs             = require('fs')
const util           = require('util')
const readFileAsync  = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const chalk          = require('chalk')
const gui            = require('../gui')

const log = console.log

const config = async (config, options) => {
  if (!options.id || !options.name || !options.appv) {
    log(chalk.red('You must provide the config.xml and also app name, id and version to config'))
    options.outputHelp()
    process.exit(1)
  }
  
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
      [options.id, options.name, options.appv]
      )
      
      if (!confirmation) {
      log(chalk.red('Aborted! No file have been changed.'))
      process.exit(1)
    }

    parsedConfig.widget.name._text          = options.name
    parsedConfig.widget._attributes.version = options.appv
    parsedConfig.widget._attributes.id      = options.id
    
    const outConfig   = xml.js2xml(parsedConfig, {compact: true, spaces: 4})
    const outFileName = options.out || 'out.xml'
    
    gui.log(`writing ${outFileName}`)
    await writeFileAsync(outFileName, outConfig)
    gui.log('write complete')
    
    log('')
    log(chalk.green('Success!'))
    process.exit(0)
  } catch (error) {
    log(chalk.red("An error ocurred", error))
  }
}

module.exports = config
