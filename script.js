let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(
	65,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.z = 5
scene.add(camera)

let box = new THREE.BoxGeometry(1, 1, 1)
let material = new THREE.MeshBasicMaterial({ color: "red" })
let mesh = new THREE.Mesh(box, material)

mesh.rotation.z = Math.PI / 4
scene.add(mesh)

const canvas = document.querySelector("canvas")
let renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

let clock = new THREE.Clock()
const animate = () => {
	window.requestAnimationFrame(animate)
	renderer.render(scene, camera)
	mesh.rotation.y = clock.getElapsedTime()
	mesh.rotation.x = clock.getElapsedTime()
}
animate()
