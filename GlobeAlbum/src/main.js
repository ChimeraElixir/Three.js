import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)

camera.position.set(0, 0, 30)

const axesHelper = new THREE.AxesHelper(30)
scene.add(axesHelper)

const canvas = document.querySelector("#draw")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Set scene background to white
// scene.background = new THREE.Color(0xffffff) // White background

// // Set renderer background to white
// renderer.setClearColor(0xffffff) // White clear color

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Create a texture loader
const textureLoader = new THREE.TextureLoader()

// Load your image
const texture = textureLoader.load("./images/image.jpeg")

const rgbeLoader = new RGBELoader()
rgbeLoader.load(
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/gym_entrance_1k.hdr",
	(texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		// scene.background = texture
		scene.environment = texture
	}
)

const gltfLoader = new GLTFLoader()

gltfLoader.load("./models/globe.glb", (gltf) => {
	const model = gltf.scene
	scene.add(model)
	model.scale.set(5, 5, 5)
	console.log(model)
	// globe.material = new THREE.MeshStandardMaterial({
	// 	map: texture,
	// })
})

// // Create a single sphere
// const sphere = new THREE.SphereGeometry(
// 	15, // radius
// 	15, // widthSegments
// 	15 // heightSegments
// )

// // Create a custom shader material that can handle multiple textures
// const material = new THREE.ShaderMaterial({
// 	wireframe: true,
// 	uniforms: {
// 		texture1: { value: texture },
// 	},
// 	vertexShader: `
//         varying vec2 vUv;
//         void main() {
//             vUv = uv;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
// 	fragmentShader: `
//         uniform sampler2D texture1;
//         varying vec2 vUv;
//         void main() {
//             // Calculate which segment we're in (15x15 grid)
//             float segmentWidth = 1.0 / 15.0;
//             float segmentHeight = 1.0 / 15.0;
            
//             // Target a specific segment (for example, segment at position 5,5)
//             // You can change these numbers to target different segments (0-14)
//             float targetSegmentX = 5.0;
//             float targetSegmentY = 5.0;
            
//             if(vUv.x >= segmentWidth * targetSegmentX && 
//                vUv.x < segmentWidth * (targetSegmentX + 1.0) &&
//                vUv.y >= segmentHeight * targetSegmentY && 
//                vUv.y < segmentHeight * (targetSegmentY + 1.0)) {
//                 gl_FragColor = texture2D(texture1, vec2(
//                     (vUv.x - segmentWidth * targetSegmentX) / segmentWidth,
//                     (vUv.y - segmentHeight * targetSegmentY) / segmentHeight
//                 ));
//             } else {
//                 gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0);
//             }
//         }
//     `,
// 	side: THREE.DoubleSide,
// })

// const globeMesh = new THREE.Mesh(sphere, material)
// scene.add(globeMesh)

// console.log(globeMesh)

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
})

function animate() {
	requestAnimationFrame(animate)
	// globeGroup.rotation.y += 0.001 // Uncomment to add rotation
	renderer.render(scene, camera)
	controls.update()
}

renderer.setAnimationLoop(animate)
