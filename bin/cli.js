#!/usr/bin/env node

const { Command } = require('commander');
const { generateMigration } = require('../src/migration');
const program = new Command();

program
  .name('migrator-plugin')
  .description('A plugin to generate migration files from models')
  .version('1.0.0');

program
  .command('create-migration')
  .description('Generate migration files based on models')
  .requiredOption('-m, --models <path>', 'Path to models folder')
  .option('-t, --template <path>', 'Path to custom migration template')
  .action((options) => {
    generateMigration(options.models, options.template);
  });

program.parse(process.argv);
