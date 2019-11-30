import { workspace } from 'vscode';
import { getWorkspaceRoot, exec, getEv3duderPath, getProjectName, getCStandardLibrary, getCompilerPathPrefix } from '../utils';

export async function buildProject() {
    await workspace.saveAll(); // TODO: Move somewhere else
    await compile();
    await buildRbf();
}

async function compile() {
    await exec(`${getCompilerPathPrefix()}`, getWorkspaceRoot(),[
        'main.c',
        '-I', 'lib/c4ev3/include',
        '-L', `lib/c4ev3/${getCStandardLibrary()}`,
        '-l', 'ev3api'
    ]);
}

async function buildRbf() {
    const projectName = getProjectName();
    await exec(getEv3duderPath(), getWorkspaceRoot(), [
        'mkrbf',
        `../prjs/${projectName}/${projectName}.elf`, `${projectName}.rbf`
    ]);
}

