
const planeGeometry = new THREE.PlaneGeometry(10, 10);

const material = new THREE.MeshStandardMaterial({ roughness: 0, metalness: 0.5 });
material.map = new THREE.HTMLTexture(element);

const mesh = new THREE.Mesh(planeGeometry, material);
mesh.position.z = 0.05;
scene.add(mesh);


interactions.add(mesh);
