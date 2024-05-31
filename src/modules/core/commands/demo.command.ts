import { Arguments } from 'yargs';

import { CommandItem } from '../types';

import { DemoCommandArguments } from './types';

export const DemoCommand: CommandItem<any, DemoCommandArguments> = async (app) => ({
    command: ['demo', 'd'],
    describe: 'A demo command',
    builder: {
        sleep: {
            type: 'boolean',
            alias: 's',
            describe: ' App will sleep?',
            default: false,
        },
    },
    handler: async (args: Arguments<DemoCommandArguments>) => {
        const { configure } = app;
        const appName = await configure.get<string>('app.name');
        const sleep = args.sleep ? ' will to sleep' : '';
        console.log(`It's just a demo command, My app ${appName}${sleep}`);
    },
});
