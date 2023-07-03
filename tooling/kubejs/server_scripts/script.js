// priority: 0
let Minecraft = java("net.minecraft.client.Minecraft").getInstance()
let ScreenIconExporter = java("org.cyclops.iconexporter.client.gui.ScreenIconExporter")
let export_started = false

onEvent('player.logged_in', event => {
	console.info("Logged In, running extract")
	console.info(event)
	event.server.scheduleInTicks(40,event.server,(callback)=>{
		let exporter = new ScreenIconExporter(128,Minecraft.getInstance().getWindow().getGuiScale())
		export_started = true
		Client.setCurrentScreen(exporter)
		})
	})
onEvent('server.tick', event=>{
	if(export_started){
		if(Client.getCurrentScreen()==null){
			Minecraft.stop()
		}
	}
	})
