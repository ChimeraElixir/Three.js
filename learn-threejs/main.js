import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RGBELoader } from "three/addons/loaders/RGBELoader.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import * as lil from "lil-gui"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(0, 0, 5)

const canvas = document.querySelector("#draw")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const asixHelper = new THREE.AxesHelper(5)
scene.add(asixHelper)

const rbgeloader = new RGBELoader()
rbgeloader.load(
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lakeside_sunrise_1k.hdr",
	(texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		scene.environment = texture
		// scene.background = texture
	}
)

const gltfLoader = new GLTFLoader()
gltfLoader.load("wooden_box.glb", (gltf) => {
	gltf.scene.position.y = -1
	scene.add(gltf.scene)
})

// let ambientLight = new THREE.AmbientLight(0xffffff, 2)
// scene.add(ambientLight)

// let directionalLight = new THREE.DirectionalLight(0xffffff, 2)
// directionalLight.position.set(2, 2, 2)
// scene.add(directionalLight)

// let pointLight = new THREE.PointLight(0xffffff, 1,10,2)
// pointLight.position.set(.3, -1.34, 1)
// scene.add(pointLight)

// let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2)
// scene.add(directionalLightHelper)

// let sphereSize = .2
// let pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize)
// scene.add(pointLightHelper)

// let loader = new THREE.TextureLoader()
// let color = loader.load("./textures/paper_0012_color_1k.jpg")
// let roughness = loader.load("./textures/paper_0012_roughness_1k.jpg")
// let normal = loader.load("./textures/paper_0012_normal_opengl_1k.png")
// let height = loader.load("./textures/paper_0012_height_1k.png")

// const geometry = new THREE.BoxGeometry(3, 1.8, 2,100,100)
// const material = new THREE.MeshStandardMaterial({
// 	map: color,
// 	roughnessMap: roughness,
// 	normalMap: normal,
// 	side: THREE.DoubleSide,
// })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// const gui = new lil.GUI()

// const lightFolder = gui.addFolder('Lights')

// const ambientLightFolder = lightFolder.addFolder('Ambient Light')
// ambientLightFolder.add(ambientLight, 'intensity').min(0).max(10).step(0.1).name('Intensity')

// const directionalLightFolder = lightFolder.addFolder('Directional Light')
// directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.1).name('Intensity')
// directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.1).name('X Position')
// directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.1).name('Y Position')
// directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.1).name('Z Position')

// const pointLightFolder = lightFolder.addFolder('Point Light')
// pointLightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.1).name('Intensity')
// pointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.1).name('X Position')
// pointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.1).name('Y Position')
// pointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.1).name('Z Position')
// pointLightFolder.add(pointLight, 'distance').min(0).max(20).step(0.1).name('Distance')
// pointLightFolder.add(pointLight, 'decay').min(0).max(10).step(0.1).name('Decay')

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
})

function animate() {
	window.requestAnimationFrame(animate)
	renderer.render(scene, camera)
	controls.update()
	// cube.rotation.x += 0.01
	// cube.rotation.y += 0.01
}
animate()
