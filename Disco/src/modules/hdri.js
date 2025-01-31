import * as THREE from "three"

export function hdriLoader(scene, hdri,rgbeloader) {

	rgbeloader.load(hdri, (texture) => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		scene.environment = texture
        // scene.background = texture
	})
}
