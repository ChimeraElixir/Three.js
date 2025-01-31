import * as THREE from "three"

export function setupAudio(camera, scene, audioLoader) {
	const listener = new THREE.AudioListener()
	camera.add(listener)

	const sound = new THREE.PositionalAudio(listener)
	const obj = new THREE.Object3D()
	scene.add(obj)
	obj.position.set(30, 15, 30)
	obj.add(sound) // Add sound only once

	audioLoader.load("sounds/xxanteria-baixo.mp3", function (buffer) {
		sound.setBuffer(buffer)
		sound.setRefDistance(10)
		sound.setLoop(true) // Make the music loop
		sound.setVolume(0.8) // Set volume

		// Resume audio context before playing
		if (listener.context.state === "suspended") {
			listener.context.resume().then(() => {
				sound.play()
			})
		} else {
			sound.play()
		}
	})

	return sound
}
