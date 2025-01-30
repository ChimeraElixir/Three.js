import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { RGBELoader } from "three/addons/loaders/RGBELoader.js"

//Renderer
const canvas = document.querySelector("canvas")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

//Scene and Camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	200
)
camera.position.set(40, 20, 40)

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axisHelper = new THREE.AxesHelper(60)
scene.add(axisHelper)

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio( listener );

const audioLoader = new THREE.AudioLoader()
audioLoader.load(
	"sounds/dark cat - BUBBLE TEA (feat. juu  cinders).mp3",
	function (buffer) {
		sound.setBuffer(buffer)
		sound.setRefDistance(20)
		sound.play()
	}
)
const obj = new THREE.Object3D()
scene.add(obj)
obj.add(sound)

obj.position.set(30, 20, 30) // Position your object
obj.add(sound) 

// const rgbeLoader = new RGBELoader()
// rgbeLoader.load(
// 	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_02_1k.hdr",
// 	(texture) => {
// 		texture.mapping = THREE.EquirectangularReflectionMapping
// 		scene.environment = texture
// 		// scene.background = texture
// 	}
// )

// const ambientLight = new THREE.AmbientLight(0x333333, 100)
// ambientLight.position.set(15, 15, 15)
// scene.add(ambientLight)

const Lights = []
function light(color, intensity, distance, x, y, z) {
	const pointLight = new THREE.PointLight(color, intensity, distance)
	pointLight.position.set(x, y, z)
	scene.add(pointLight)
	pointLight.castShadow = true
	Lights.push(pointLight)

	// const lightHelper = new THREE.PointLightHelper(pointLight)
	// scene.add(lightHelper)

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

const noOfLights = 10

const lightColors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff, 0xffffff]

for (let i = 0; i < noOfLights; i++) {
	let color = lightColors[Math.floor(Math.random() * lightColors.length)]
	light(color, 100, 25, 15, 14, 15)
}

// Initial light creation
// light(0xffffff, 1000, 25, 15, 14, 15)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
// directionalLight.position.set(30, 30, 30)
// scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)

const planeGeometry = new THREE.PlaneGeometry(30, 30, 30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({
	transparent: true,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotateX(Math.PI / 2)
plane.position.set(15, 0, 15)
scene.add(plane)

const textureLoader = new THREE.TextureLoader()

const wallMaterial = new THREE.MeshStandardMaterial({
	color: 0x50465b,
	map: textureLoader.load("./textures/walls/v1y3lcxo_2k_normal.png"),
	roughnessMap: textureLoader.load(
		"./textures/walls/v1y3lcxo_2k_roughness.png"
	),
	aoMap: textureLoader.load("./textures/walls/v1y3lcxo_2k_ao.png"),

	metalnessMap: textureLoader.load(
		"./textures/walls/v1y3lcxo_2k_metalness.png"
	),
	side: THREE.DoubleSide,
})

const wall1 = new THREE.Mesh(planeGeometry, wallMaterial)
const wall2 = new THREE.Mesh(planeGeometry, wallMaterial)
const walltop = new THREE.Mesh(planeGeometry, wallMaterial)

wall1.position.set(15, 15, 0)
wall2.position.set(0, 15, 15)
walltop.position.set(15, 30, 15)

wall2.rotateY(Math.PI / 2)
walltop.rotateX(Math.PI / 2)

scene.add(wall1)
scene.add(wall2)
scene.add(walltop)

const rbgeloader = new RGBELoader()
rbgeloader.load(
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/gym_entrance_1k.hdr",
	(texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		scene.environment = texture
		// scene.background = texture
	}
)

const loader = new GLTFLoader()
let floorMixer
loader.load("./models/animated_dance_floor_neon_lights.glb", (gltf) => {
	const floor = gltf.scene
	scene.add(floor)
	floor.scale.set(5, 5, 5)
	floor.position.set(15, 0, 15)
	floor.receiveShadow = true

	const clip = gltf.animations[0]
	floorMixer = new THREE.AnimationMixer(floor)
	const action = floorMixer.clipAction(clip)
	action.play()
})
// loader.load("./models/disco_ball_with_colored_lights.glb", (gltf) => {
// 	const discoBall = gltf.scene
// 	walltop.add(discoBall)
// 	discoBall.scale.set(7, 7, 7)
// 	discoBall.rotateX(-Math.PI / 2)
// 	discoBall.position.set(0, 0, 6.5)

// 	// Create animation mixer for disco ball
// 	const discoBallMixer = new THREE.AnimationMixer(discoBall)
// 	mixers.push(discoBallMixer)

// 	// Create a rotation animation clip
// 	const rotationTrack = new THREE.NumberKeyframeTrack(
// 		".rotation[y]", // Property to animate
// 		[0, 4], // Keyframe times (in seconds)
// 		[0, Math.PI * 2] // Values at each keyframe (full rotation)
// 	)

// 	const clip = new THREE.AnimationClip("rotate", 4, [rotationTrack])
// 	const action = discoBallMixer.clipAction(clip)

// 	// Set the animation to loop infinitely
// 	action.setLoop(THREE.LoopRepeat)
// 	action.play()
// })

loader.load("./models/free_realistic_disco_ball.glb", (gltf) => {
	const discoBall = gltf.scene
	walltop.add(discoBall)
	discoBall.scale.set(7, 7, 7)
	discoBall.rotateX(-Math.PI / 2)
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

// Create an array to store all mixers
const mixers = []

const rows = 30
const cols = 30
const matrix = Array(rows)
	.fill()
	.map(() => Array(cols).fill(0))

// Mark all edge boxes as occupied (1)
for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
		if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
			matrix[i][j] = 1
		}
	}
}

function characterLocation() {
	// Generate random positions between 0 and 29 for matrix indices
	const matrixX = Math.floor(Math.random() * rows)
	const matrixY = Math.floor(Math.random() * cols)

	// Convert matrix positions to world coordinates (-15 to 15)
	const randomX = matrixX - rows / 2
	const randomY = matrixY - cols / 2
	const rotation = Math.random() * 2 * Math.PI

	if (matrix[matrixX][matrixY] === 0) {
		matrix[matrixX][matrixY] = 1
		matrix[matrixX][matrixY + 1] = 1
		matrix[matrixX][matrixY - 1] = 1
		matrix[matrixX + 1][matrixY] = 1
		matrix[matrixX - 1][matrixY] = 1
		return { x: randomX, y: randomY, r: rotation }
	} else {
		return characterLocation()
	}
}

function loadModel(path, scale) {
	loader.load(path, (gltf) => {
		const model = gltf.scene
		plane.add(model)
		model.scale.set(scale, scale, scale)
		model.rotateX(-Math.PI / 2)

		//Set model position and rotation
		const { x, y, r } = characterLocation()
		model.position.set(x, y, 0)
		model.rotation.y = r

		//Create animation mixer and store it in the mixers array
		const mixer = new THREE.AnimationMixer(model)
		mixers.push(mixer)

		console.log(`Loaded model: ${path} at position x:${x}, y:${y}`)

		const clips = gltf.animations
		const idx = Math.floor(Math.random() * clips.length)
		const clip = clips[idx]
		const action = mixer.clipAction(clip)
		action.play()
	})
}

const models = {
	1: { path: "./models/dancing.glb", scale: 2 },
	2: { path: "./models/default_chief.glb", scale: 1.3 },
	3: { path: "./models/dancing_girl.glb", scale: 2 },
	4: { path: "./models/dancing_penguin.glb", scale: 0.015 },
	5: { path: "./models/beer_bot_animated.glb", scale: 2.3 },
	6: { path: "./models/banana_dancing_fortnite.glb", scale: 3 },
	7: { path: "./models/gerl_cartoon_rumba_dancing.glb", scale: 3 },
	// 8: { path: "./models/shrek_dancing.glb", scale: 2 },
	8: { path: "./models/simio_monkey_dancing.glb", scale: 0.035 },
	9: { path: "./models/tifa_dancing.glb", scale: 1.75 },
	10: {
		path: "./models/woman_rumba_dancing_-_mulher_dancando_rumba.glb",
		scale: 2,
	},
	11: { path: "./models/harley_quinn_animated.glb", scale: 2 },
	12: { path: "./models/nabbagos_moves.glb", scale: 0.7 },
}

const noofmodal = 10
const modelCount = Object.keys(models).length

for (let i = 1; i <= noofmodal; i++) {
	const model = Math.floor(Math.random() * modelCount) + 1
	loadModel(models[model].path, models[model].scale)
}

console.log(mixers)

// let mixer = null
// const loader = new GLTFLoader()
// loader.load(
// 	"./models/dancing.glb",
// 	(gltf) => {
// 		const model = gltf.scene
// 		plane.add(model)
// 		model.scale.set(2, 2, 2)
// 		const randomX = Math.random() * 50 - 25
// 		const randomZ = Math.random() * 50 - 25
// 		model.rotateX(-Math.PI / 2)
// 		model.position.set(randomX, randomZ, 0)
// 		model.rotation.y = Math.random() * 2 * Math.PI
// 		mixer = new THREE.AnimationMixer(model)
// 		const clips = gltf.animations
// 		console.log(clips)

// 		const clip = clips[0]
// 		const action = mixer.clipAction(clip)
// 		action.play()
// 	},
// 	(progress) => {
// 		console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`)
// 	},
// 	(error) => {
// 		console.error("Error loading model:", error)
// 	}
// )

const clock = new THREE.Clock()
function animate() {
	controls.update()

	const delta = clock.getDelta()
	// if(mixer){
	// 	mixer.update(delta)
	// }
	// Update all mixers in the array

	if (floorMixer) {
		floorMixer.update(delta)
	}
	mixers.forEach((mixer) => {
		mixer.update(delta)
	})
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
})
