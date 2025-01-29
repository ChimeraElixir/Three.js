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
camera.position.set(75,50,75)

const ambientLight = new THREE.AmbientLight(0x333333, 200)
scene.add(ambientLight)

const planeGeometry = new THREE.PlaneGeometry(50,50,30,30)
const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotateX(Math.PI / 2)
plane.position.set(25,0,25)

scene.add(plane)

// const rbgeloader = new RGBELoader()
// rbgeloader.load(
// 	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lakeside_sunrise_1k.hdr",
// 	(texture) => {
// 		texture.mapping = THREE.EquirectangularReflectionMapping
// 		scene.environment = texture
// 		// scene.background = texture
// 	}
// )

const spotLight = new THREE.SpotLight(0xffffff, 1000, 100, Math.PI / 2)
spotLight.position.set(50, 50, 50)
scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 5)
scene.add(spotLightHelper)

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axisHelper = new THREE.AxesHelper(60)
scene.add(axisHelper)

let mixer
const loader = new GLTFLoader()
loader.load(
	"./models/dancing.glb",
	(gltf) => {
		const model = gltf.scene
		plane.add(model)
    model.scale.set(2,2,2)
    const randomX = Math.random() * 50 - 25 
		const randomZ = Math.random() * 50 - 25
		model.rotateX(-Math.PI / 2)
    model.position.set(randomX,randomZ,0)
    model.rotation.y = Math.random() * 2 * Math.PI
		mixer = new THREE.AnimationMixer(model)
		const clips = gltf.animations
		console.log(clips)
		const clip = THREE.AnimationClip.findByName(clips, "mixamo.com")
		const action = mixer.clipAction(clip)
		action.play()
	},
	(progress) => {
		console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`)
	},
	(error) => {
		console.error("Error loading model:", error)
	}
)
// loader.load(
// 	"./models/dancing.glb",
// 	(gltf) => {
// 		plane.add(gltf.scene)
//     gltf.scene.rotateX(Math.PI/2)

//     gltf.scene.position.z = 10

//     gltf.scene.scale.set(0.5, 0.5, 0.5)
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
	if (mixer) {
		mixer.update(clock.getDelta())
	}
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
})
