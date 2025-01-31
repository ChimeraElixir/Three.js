import * as THREE from "three"



export function createWalls(
	scene,
	width,
	height,
	widthSegments,
	heightSegments,
	texture,
	textureLoader
) {
	const planeGeometry = new THREE.PlaneGeometry(
		height,
		width,
		heightSegments,
		widthSegments
	)
	const planeMaterial = new THREE.MeshStandardMaterial({
		transparent: true,
	})
	const wallMaterial = new THREE.MeshStandardMaterial({
		color: 0x50465b,
		map: textureLoader.load(texture.map),
		roughnessMap: textureLoader.load(texture.roughnessMap),
		aoMap: textureLoader.load(texture.aoMap),

		metalnessMap: textureLoader.load(texture.metalnessMap),
		side: THREE.DoubleSide,
	})

	const floor = new THREE.Mesh(planeGeometry, planeMaterial)
	const rightWall = new THREE.Mesh(planeGeometry, wallMaterial)
	const leftWall = new THREE.Mesh(planeGeometry, wallMaterial)
	const topWall = new THREE.Mesh(planeGeometry, wallMaterial)

	rightWall.position.set(15, 15, 0)
	leftWall.position.set(0, 15, 15)
	topWall.position.set(15, 30, 15)
	floor.position.set(15, 0, 15)

	leftWall.rotateY(Math.PI / 2)
	topWall.rotateX(Math.PI / 2)
	floor.rotateX(Math.PI / 2)

	scene.add(floor)
	scene.add(rightWall)
	scene.add(leftWall)
	scene.add(topWall)

    return {floor,rightWall,leftWall,topWall}
}

export function danceFloorLoader(scene,danceFloor,loader,mixers) {
    loader.load(danceFloor, (gltf) => {
        const danceFloor = gltf.scene
        scene.add(danceFloor)

        danceFloor.scale.set(5, 5, 5)
        danceFloor.position.set(15, 0, 15)
        danceFloor.receiveShadow = true

        const clip = gltf.animations[0]
        const floorMixer = new THREE.AnimationMixer(danceFloor)
        mixers.push(floorMixer)
        const action = floorMixer.clipAction(clip)
        action.play()
    })
}