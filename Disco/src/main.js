import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { RGBELoader } from "three/addons/loaders/RGBELoader.js"
import { setupLights } from "./modules/lights.js"
import { createWalls } from "./modules/walls.js"
import { hdriLoader } from "./modules/hdri.js"
import { globeLoader } from "./modules/enviornment.js"
import { danceFloorLoader } from "./modules/walls.js"
import { models } from "./modules/models.js"
import { setupAudio } from "./modules/audio.js"

//Renderer
const canvas = document.querySelector("canvas")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)


//Scene and Camera
export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	200
)
camera.position.set(45, 25, 45)
scene.add(camera)

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const loadingManager = new THREE.LoadingManager()

const rgbeloader = new RGBELoader(loadingManager)
const loader = new GLTFLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)
const audioLoader = new THREE.AudioLoader(loadingManager)

const progressBar = document.getElementById("progress-bar")
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
	progressBar.value = (itemsLoaded / itemsTotal) * 100
}
// // create an AudioListener and add it to the camera
// const listener = new THREE.AudioListener()
// camera.add(listener)

// // create the PositionalAudio object (passing in the listener)
// const sound = new THREE.PositionalAudio(listener)
// audioLoader.load(
// 	"sounds/dark cat - BUBBLE TEA (feat. juu  cinders).mp3",
// 	function (buffer) {
// 		sound.setBuffer(buffer)
// 		sound.setRefDistance(10)
// 		sound.play()
// 	}
// )
// const obj = new THREE.Object3D()
// scene.add(obj)
// obj.add(sound)

// obj.position.set(30, 15, 30)
// obj.add(sound)

const progressBarContainer = document.querySelector(".progress-bar-container")
const playButton = document.getElementById("play-button")

loadingManager.onLoad = () => {
	// Show play button when loading is complete
	playButton.style.display = "block"

	// Setup click handler for play button
	playButton.addEventListener(
		"click",
		() => {
			const sound = setupAudio(camera, scene, audioLoader)
			// Hide the entire container after clicking play
			progressBarContainer.style.display = "none"
		},
		{ once: true }
	) // ensure it only triggers once
}

//RGBE Loader HDRI
export const mixers = []
const Lights = []

const hdri =
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/gym_entrance_1k.hdr"
const enviornment = "./models/free_realistic_disco_ball.glb"
const danceFloor = "./models/animated_dance_floor_neon_lights.glb"

const texture = {
	map: "./textures/walls/v1y3lcxo_2k_normal.png",
	roughnessMap: "./textures/walls/v1y3lcxo_2k_roughness.png",
	aoMap: "./textures/walls/v1y3lcxo_2k_ao.png",
	metalnessMap: "./textures/walls/v1y3lcxo_2k_metalness.png",
}

const { floor, rightWall, leftWall, topWall } = createWalls(
	scene,
	30,
	30,
	30,
	30,
	texture,
	textureLoader
)

hdriLoader(scene, hdri, rgbeloader)

globeLoader(scene, enviornment, loader, mixers, topWall)

danceFloorLoader(scene, danceFloor, loader, mixers)

setupLights(scene, 10, Lights)

models(loader, 1, mixers, floor, 30, 30)

console.log(mixers)

const clock = new THREE.Clock()
function animate() {
	controls.update()

	const delta = clock.getDelta()
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
