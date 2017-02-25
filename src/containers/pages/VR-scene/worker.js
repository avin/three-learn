const THREE = require('three');

const ProceduralCity = function () {
    // build the base geometry for each building
    //const geometry = new THREE.CubeGeometry(1, 1, 1);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // translate the geometry to place the pivot point at the bottom instead of the center
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    // buildMesh
    const buildingMesh = new THREE.Mesh(geometry);

    const cityGeometry = new THREE.Geometry();
    for (let i = 0; i < 20000; i++) {
        // put a random position
        buildingMesh.position.x = Math.floor(Math.random() * 200 - 100) * 10;
        buildingMesh.position.z = Math.floor(Math.random() * 200 - 100) * 10;

        // put a random scale
        buildingMesh.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        buildingMesh.scale.y = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
        buildingMesh.scale.z = buildingMesh.scale.x;

        // merge it with cityGeometry - very important for performance
        buildingMesh.updateMatrix();
        cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
    }

    return cityGeometry;
};

self.addEventListener('message', function(e) {

    console.log('START_TRANSFER')
    self.postMessage(new THREE.BufferGeometry().fromGeometry( ProceduralCity() ));
}, false);