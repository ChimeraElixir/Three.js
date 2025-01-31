import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export function createScene() {
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		200
	)
	camera.position.set(40, 20, 40)
	scene.add(camera)

	const canvas = document.querySelector("canvas")
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)

	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true

	return { scene, camera, renderer, controls }
}
