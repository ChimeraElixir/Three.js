import * as THREE from "three"


export function globeLoader(scene,enviornment,loader,mixers) {
	loader.load(enviornment, (gltf) => {
	const discoBall = gltf.scene
    scene.add(discoBall)

	discoBall.scale.set(9, 9, 9)

	discoBall.position.set(0, 0, 6.5)

	// Create animation mixer for disco ball
	const discoBallMixer = new THREE.AnimationMixer(discoBall)
	mixers.push(discoBallMixer)

	// Create a rotation animation clip
	const rotationTrack = new THREE.NumberKeyframeTrack(
		".rotation[y]", // Property to animate
		[0, 4], // Keyframe times (in seconds)
		[0, Math.PI * 2] // Values at each keyframe (full rotation)
	)

	const clip = new THREE.AnimationClip("rotate", 4, [rotationTrack])
	const action = discoBallMixer.clipAction(clip)

	// Set the animation to loop infinitely
	action.setLoop(THREE.LoopRepeat)
	action.play()
	})
}