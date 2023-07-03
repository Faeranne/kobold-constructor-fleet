// priority: 0
let Minecraft = java("net.minecraft.client.Minecraft").getInstance()
onEvent('ui.main_menu', event => {
	console.info("main menu")
	console.info(event)
	Minecraft.loadLevel("New World")
	})
