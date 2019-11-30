import { workspace } from 'vscode';
import { Configuration } from '../Configuration';
import { getWorkspaceRoot, exec, getProjectName } from './utils';

export async function buildProject(configuration: Configuration) {
    await compile(configuration);
    await buildRbf(configuration);
}

async function compile(configuration: Configuration) {
    await exec(`${configuration.getCompilerPathPrefix()}gcc`, getWorkspaceRoot(), [
        'main.c',
        '-I', 'libs/c4ev3-v0.1.0/include',
        '-L', `libs/c4ev3-v0.1.0/lib/${configuration.getCStandardLibrary()}`,
        '-o', `${getProjectName()}.elf`,
        '-l', 'ev3api'
    ]);
}

async function buildRbf(configuration: Configuration) {
    const projectName = getProjectName();
    await exec(configuration.getEv3duderPath(), getWorkspaceRoot(), [
        'mkrbf',
        `../prjs/${projectName}/${projectName}.elf`, `${projectName}.rbf`
    ]);
}

