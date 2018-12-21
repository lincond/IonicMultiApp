const Table   = require('cli-table')
const co     = require('co')
const prompt = require('co-prompt')
const chalk  = require('chalk')

const createConfirmationTable = (actualValues, newValues) => {
  const table = new Table({ head: ["", "Actual value", "New value"]})
  table.push(
    { 'App ID': [actualValues[0], newValues[0]]},
    { 'App Name': [actualValues[1], newValues[1]]},
    { 'App Version': [actualValues[2], newValues[2]]}
  )
  console.log('')
  console.log(table.toString())
  return co(function *() {
     return yield prompt.confirm('confirm modifications and proceed? (y/N) ')
  })
}

const log = (msg) => {
  console.log(`[${chalk.green([new Date().toLocaleString()])}] ${msg}`)
}

module.exports = {
  createConfirmationTable: createConfirmationTable,
  log                    : log
}