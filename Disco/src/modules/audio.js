import * as THREE from "three"

export function setupAudio(camera, scene) {
	const listener = new THREE.AudioListener()
	camera.add(listener)

	const sound = new THREE.PositionalAudio(listener)
	const obj = new THREE.Object3D()
	obj.position.set(15, 15, 15)
	scene.add(obj)
	obj.add(sound)

	const audioLoader = new THREE.AudioLoader()
	return new Promise((resolve, reject) => {
		audioLoader.load(
			"./sounds/music.mp3",
			(buffer) => {
				sound.setBuffer(buffer)
				sound.setRefDistance(20)
				sound.setMaxDistance(100)
				sound.setLoop(true)
				sound.setVolume(1.0)
				resolve(sound)
			},
			undefined,
			reject
		)
	})
}
