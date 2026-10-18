import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';


/** Replace the global installation with copied package files and runtime dependencies. */
function publishGlobal() {
  let source = realpathSync(fileURLToPath(new URL('../', import.meta.url)));
  let {name} = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));
  let globalRoot = realpathSync(runNpm(source, ['root', '--global']).trim());
  let target = resolve(globalRoot, name);

  if (dirname(target) !== globalRoot || target === source) {
    throw new Error(`Expected a package directory directly inside ${globalRoot}`);
  }

  if (existsSync(target)) {
    let installed = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));

    if (installed.name !== name || lstatSync(target).isSymbolicLink()) {
      throw new Error(`Expected an unlinked ${name} installation at ${target}`);
    }

    if (realpathSync(target) !== target) {
      throw new Error(`The installation must resolve directly to ${target}`);
    }
  }

  let [pack] = JSON.parse(runNpm(source, ['pack', '--dry-run', '--json', '--ignore-scripts']));

  if (existsSync(target)) {
    console.log(`Deleting ${target}`);
    rmSync(target, {recursive: true});
  }

  for (let {path} of pack.files) {
    let destination = join(target, path);
    mkdirSync(dirname(destination), {recursive: true});
    copyFileSync(join(source, path), destination);
  }

  console.log(`Copied ${pack.files.length} package files to ${target}`);
  console.log(runNpm(target, [
    'install',
    '--global=false',
    '--omit=dev',
    '--omit=optional',
    '--ignore-scripts',
    '--package-lock=false',
    '--no-audit',
    '--no-fund'
  ]));
}

/** Run npm through its active CLI so paths work on Windows and Unix. */
function runNpm(cwd, args) {
  if (!process.env.npm_execpath) {
    throw new Error('Run this script with npm run publish:global');
  }

  return execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    encoding: 'utf8'
  });
}


publishGlobal();
