# modpack_building_tools

## Preliminary instructions

1. Clone repo using `git clone git@github.com:Faeranne/kobold-constructor-fleet.git`
1. Enter the project directory `cd kobold-constructor-fleet`
1. Install Yarn dependencies `yarn install`
1. Run gather task `node setup.js`.  Due to an existing installer issue, this might crash the first time. simply re-run it and it should work successfully.
1. Once minecraft closes, run `node app.mjs` to build the package.  Final package can be found in `workdir/images.zip`.  Name will probably change.
1. Run `yarn esbuild --bundle client/ts/elements.ts --outfile=client/js/elements.js` to build the client.
1. serve `client` via your favorite static site method.  I use `python -m http.server`
1. load up the browser and upload the `images.zip` file to the client.  Should automatically load in all the recipes and items that were found.

## Rebuilding the pack

Once the first run has happened, you can add mods to the `workdir/minecraft/mods` folder and re-run `setup.js` then `app.mjs` to rebuild the zip file.  No further commands are needed


