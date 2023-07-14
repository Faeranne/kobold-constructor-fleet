import { resolveJava, DownloadTask, installForgeTask, installJavaRuntimeTask, fetchJavaRuntimeManifest, getVersionList, installTask as installMinecraftTask } from "@xmcl/installer";
import { join,relative,dirname,resolve } from 'node:path'
import { launch, Version } from '@xmcl/core'
import { platform } from 'node:os'
import { chmod, readFile, writeFile } from 'node:fs/promises'
import { mkdirp, copy } from 'fs-extra/esm'
import { fileURLToPath } from 'node:url'

const localDir = resolve('workdir')

export const getJava = () => {
  let executable = ""
  switch(platform()){
    case "win32":
      executable = "javaw.exe"
      break;
    case "linux":
    default:
      executable = "java"
  }
  return join(localDir,'.java','bin',executable)
}

export const installJava = async () => {
  const manifest = await fetchJavaRuntimeManifest();
  const installTask = installJavaRuntimeTask({destination:join(localDir,'.java'),manifest: manifest})
  return installTask.startAndWait({
    onStart: (task) => {
      console.log(`${task.path} started!`)
      if(task instanceof DownloadTask){
        const dest = relative(join(localDir,'.java'),task.to)
        console.log(`Downloading to ${dest}`)
      }
    },
    onSucceed: async (task) => {
      if(task instanceof DownloadTask){
        const dest = relative(join(localDir,'.java','bin'),task.to)
        if(!dest.startsWith('..')){
          console.log(`Making ${dest} executable`)
          await chmod(task.to,0o744);
        }
      }
    }
  });
}

const fetchMinecraftVersion = async (version) => {
  const list = (await getVersionList()).versions;
  let finalVersion
  list.forEach((vers) => {
    if(vers.id == version){
      finalVersion = vers
    }
  })
  return finalVersion
}

const installMinecraft = async (version) => {
  const task = installMinecraftTask(version,join(localDir,'resources'))

  task.context.onStart = (task) => {
    console.log(`Started task ${task.path}.`)
  }
  task.context.onSucceed = (task) => { console.log(`Finished task ${task.path}.`)
  }
  task.context.onFailed = (task, err) => {
    console.log(`Failed task ${task.path}.`)
    console.error(err)
  }
  task.start()
  await task.wait()
  return
}

const installForge = async (forge, minecraft) => {
  const javaPath = getJava();
  const task = installForgeTask({version: forge, mcversion: minecraft},join(localDir,'resources'),{java:javaPath})
  task.context.onStart = (task) => {
    console.log(`Started task ${task.path}.`)
  }
  task.context.onSucceed = (task) => {
    console.log(`Finished task ${task.path}.`)
  }
  task.context.onFailed = (task, err) => {
    console.log(`Failed task ${task.path}.`)
    console.error(err)
  }
  await task.startAndWait()
}

export const installProfile = async () => {
  await installJava()
  const mcVersion = await fetchMinecraftVersion('1.18.2')
  await installMinecraft(mcVersion)
  await installForge('40.2.9','1.18.2')
}

export const launchProfile = async () => {
  const mcVersion = '1.18.2'
  const forgeVersion = '40.2.9'
  const javaPath = getJava();
  const gamePath = join(localDir,'minecraft');
  const resourcePath = join(localDir,'resources') 
  const runningInstance = await launch( {gamePath, resourcePath, javaPath, version:`${mcVersion}-forge-${forgeVersion}`, gameProfile:{name:"LOADERUSER"}, maxMemory:4096, extraExecOption:{stdio:'inherit'}})
  runningInstance.on('error',(err)=>{
  })
  runningInstance.on('exit',(err)=>{
  })
};

const fetchFileTask = (url,hash,loc) => {
  const options = {
    url: url,
    validator: {
      algorithm: "sha512",
      hash
    },
    destination: loc
  }
  return new DownloadTask(options).setName("downloadFile")
}

export const fetchToolingMods = async () => {
  const mods = [
    {
      id: 'architectury',
      hash: '6c8e416f22d9a257d69442d5f2620afcd92e2437304659a20418927b9066d0a928bc8eebd1e204911895b59a04e4be4c063b14303b6aafa814c56aac3c77c925',
      download: 'https://cdn.modrinth.com/data/lhGA9TYQ/versions/o069zrDa/architectury-4.11.93-forge.jar'
    },
    {
      id: 'cycloscore',
      hash: 'bdd7933fb3e3181ea691ba314683b11b3c5380930753245a08ea3d0b2af78f2356327fec058ddffb6e149d44bd0731c3e425680922fa36b0430d541a69fbc88f',
      download: 'https://cdn.modrinth.com/data/Z9DM0LJ4/versions/DRX1sdWu/CyclopsCore-1.18.2-1.17.5.jar'
    },
    {
      id: 'iconexporter',
      hash: 'dbd19713e1e3f80d60cbb7e525a8bf24297e5a43797e1a0c81ae05bd02e48c36eaa20ee8c333a590f502f5395f858831dbf4d003b0415fc62e33209f29e70b12',
      download: 'https://cdn.modrinth.com/data/8KCmS7Bd/versions/1.18.2-1.2.4/IconExporter-1.18.2-1.2.4.jar'
    },
    {
      id: 'kubejs',
      hash: 'f4b469df80aee23633342d8302356c69c055c3fcbd9635569e0ee72b148501ede03841a2ad7bf7851ba7d752ba89d5a9cc18ef1069d39a87eee3bc3a50406804',
      download: 'https://koboldkanun.sfo3.cdn.digitaloceanspaces.com/modpacks/tooling/kubejs-faeranne-tooling.jar'
    },
    {
      id: 'kubejs-ui',
      hash: '213c9405ac249816448ff59afd825d36fcd1a0ad7a27e3e3a7b983facd2f6db99a311411f07077aa72fec1c5a5d33e5dfcc2650e281846b2c3af1bb7541b4617',
      download: 'https://koboldkanun.sfo3.cdn.digitaloceanspaces.com/modpacks/tooling/kubejs-ui.jar'
    },
    {
      id: 'rhino',
      hash: '074768b8ff6bcb33feeadbee3068be755c05a6dd70b24d2380d0d706258945dcb62273ae16340830637cc7920b19233d4750b43218ccffd7131253419012a839',
      download: 'https://cdn.modrinth.com/data/sk9knFPE/versions/N59eFKIq/rhino-forge-1802.2.1-build.255.jar'
    },
  ]
  await Promise.all(
    mods.map((mod)=>{
      return fetchFileTask(mod.download,mod.hash,join(localDir,'minecraft','mods',mod.id+".jar")).startAndWait({
        onStart(task){
          console.log(`Starting mod download ${mod.id}`);
        },
        onSucceed(task){
          console.log(`Finished mod download ${mod.id}`);
        }
      })
    })
  )
}

export const cloneToolingFiles = async () => {
  await copy(join(localDir,'..','tooling'),join(localDir,'minecraft'))
}

(async ()=>{
  await mkdirp(join(localDir,'minecraft'))
  await mkdirp(join(localDir,'resources'))
  await mkdirp(join(localDir,'.java'))
  try{
    await installProfile()
    await fetchToolingMods()
    await cloneToolingFiles()
    await launchProfile()
  }catch(e){
    console.log(`Failed set ${e}`)
  }
})()
