#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const program = require('commander')
const pkgPath = require('find-up').sync('package.json')
const context = pkgPath ? path.dirname(pkgPath) : process.cwd()

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('create <name>')
  .description('create a new website powered by Gridsome')
  .action((...args) => {
    require('../lib/commands/create')(...args)
  })

try {
  // eslint-disable-next-line
  require('gridsome')({ context, program })
} catch (err) {}

// show a warning if the command does not exist
program.arguments('<command>').action((command) => {
  console.log(chalk.red(`Unknown command ${chalk.bold(command)}`))
})

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan('gridsome <command> --help')} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
