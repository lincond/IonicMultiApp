const chalk          = require('chalk')
const fs        = require('fs')
const gui       = require('../gui')
const util      = require('util')
const { spawn } = require('child_process')

const log = console.log

const unlink   = util.promisify(fs.unlink)
const copyFile = util.promisify(fs.copyFile)

const resources = async (options) => {
  if (!options.splash && !options.icon) {
    log(chalk.red('At least one of the options (splash or icon) is required'))
    process.exit(1)
  }
  
  // 1. remove .md5 files
  gui.log('removing md5 resources files...')
  try {
    if (options.splash)
      await unlink('resources/splash.png.md5')
    if (options.icon)
      await unlink('resources/icon.png.md5')
    gui.log('md5 files removed')
  } catch (error) {
    //TODO: check error type
    log(chalk.red('An error occurred while removing md5 files', error))
  }

  // 2. copy resoruces files to resources folder
  try {
    let proceed = await gui.confirm(`If you proceed the ${chalk.bold('original files')} will be ${chalk.bgRed.bold('overwritten')}. Do you want to proceed and override the files?`)
    if (!proceed) {
      log(chalk.red('Aborted! No file have been changed.'))
      process.exit(1)
    }

    if (options.splash) {
      gui.log('copying splash...')
      await copyFile(options.splash, 'resources/splash.png')
      gui.log('splash copy finished')
    }
    if (options.icon) {
      gui.log('copying icon...')
      await copyFile(options.icon, 'resources/icon.png')
      gui.log('icon copy finished')
    }
  } catch (error) {
    log(chalk.red('An error occurred while copy resources'), error)
    process.exit(1)
  }

  // 3. generate resources
  const resources = ''
  if (options.icon) resources.concat('--icon')
  if (options.splash) resources.concat(' --splash')

  gui.log('spawning ionic cordova resources ' + resources)
  const ionic = spawn('ionic', ['cordova', 'resources', resources])
  console.log()
  ionic.stdout.on('data', data => {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(data.toString())
  })
  ionic.stderr.on('data', data => console.log(chalk.red(data.toString())))
  ionic.on('close', code => {
    gui.log(`ionic exited with code ${code}`)
    if (code == 0)
      log(chalk.green('Success!'))
    else
      log(chalk.red('Failed to generate the resources'))
    process.exit(code)
  })
}

module.exports = resources