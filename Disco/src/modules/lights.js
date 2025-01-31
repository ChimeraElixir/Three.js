import * as THREE from "three"

function createLight(color, intensity, distance, x, y, z,scene,Lights) {
	const pointLight = new THREE.PointLight(color, intensity, distance)
	pointLight.position.set(x, y, z)
	scene.add(pointLight)
	pointLight.castShadow = true
	Lights.push(pointLight)


	// Target position for smooth movement
	const target = {
		x: x,
		y: y,
		z: z,
	}

	// Function to update target to new random position
	function updateTarget() {
		// Generate random positions between -15 and 15 (centered around origin)
		target.x = Math.random() * 30 // 0 to 30
		target.y = Math.random() * 30 // 0 to 30
		target.z = Math.random() * 30 // 0 to 30
	}

	// Update target every 2 seconds
	setInterval(updateTarget, 2000)

	// Add to animation loop
	function animateLight() {
		// Smooth movement towards target
		pointLight.position.x += (target.x - pointLight.position.x) * 0.02
		pointLight.position.y += (target.y - pointLight.position.y) * 0.02
		pointLight.position.z += (target.z - pointLight.position.z) * 0.02

		// Update helper position
		// lightHelper.update()

		requestAnimationFrame(animateLight)
	}

	animateLight()
	
}

export function setupLights(scene,count,Lights) {
	const lightColors = [
		0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff,
		0xffffff,
	]

	for (let i = 0; i < count; i++) {
		let color = lightColors[Math.floor(Math.random() * lightColors.length)]
		createLight(color, 100, 25, 15, 14, 15,scene,Lights)
	}
}
