import * as THREE from "three"
import { modelsData } from "./data.js"

function characterLocation(matrix, rows, cols) {
	
    // Generate random positions
    const matrixX = Math.floor(Math.random() * rows)
    const matrixY = Math.floor(Math.random() * cols)

    // Convert to world coordinates
    const randomX = matrixX - rows / 2
    const randomY = matrixY - cols / 2
    const rotation = Math.random() * 2 * Math.PI

    // Check if position is valid and available
        if (matrix[matrixX][matrixY] === 0) {
            matrix[matrixX][matrixY] = 1
            matrix[matrixX][matrixY + 1] = 1
            matrix[matrixX][matrixY - 1] = 1
            matrix[matrixX + 1][matrixY] = 1
            matrix[matrixX - 1][matrixY] = 1
            return { x: randomX, y: randomY, r: rotation }
        } else {
        return characterLocation(matrix, rows, cols)
    }

}

function loadModel(path, scale, mixers, floor, matrix, rows, cols, loader) {
	loader.load(
		path,
		(gltf) => {
			const model = gltf.scene
			floor.add(model)
			model.scale.set(scale, scale, scale)
			model.rotateX(-Math.PI / 2)

			const position = characterLocation(matrix, rows, cols)
			model.position.set(position.x, position.y, 0)
			model.rotation.y = position.r

			const mixer = new THREE.AnimationMixer(model)
			mixers.push(mixer)

			const clips = gltf.animations
			const idx = Math.floor(Math.random() * clips.length)
			const clip = clips[idx]
			const action = mixer.clipAction(clip)
			action.play()
		},
		// (progress) => {
		// 	console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`)
		// },
		// (error) => {
		// 	console.error("Error loading model:", error)
		// }
	)
}

export function models(loader, count, mixers, floor, rows, cols) {
	// Initialize matrix
	const matrix = Array(rows)
		.fill()
		.map(() => Array(cols).fill(0))

	// Mark edges as occupied
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
				matrix[i][j] = 1
			}
		}
	}

	// Load models
	for (let i = 1; i <= count; i++) {
		const modelIndex =
			Math.floor(Math.random() * Object.keys(modelsData).length) + 1
		const modelData = modelsData[modelIndex]
		if (modelData) {
			loadModel(
				modelData.path,
				modelData.scale,
				mixers,
				floor,
				matrix,
				rows,
				cols,
				loader
			)
		}
	}
}
