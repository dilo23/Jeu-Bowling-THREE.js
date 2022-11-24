let cameraControls;
let canvas = document.getElementById("canvas");
let stats = new Stats();
let clock = new THREE.Clock();
let canvasWidth = canvas.offsetWidth;
let canvasHeight = canvas.offsetHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 30, canvasWidth / canvasHeight, 1, 1000 );

function init() {
    let canvasWidth = canvas.offsetWidth;
    let canvasHeight = canvas.offsetHeight;

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 30, canvasWidth / canvasHeight, 1, 1000 );

    let renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.setClearColor(new THREE.Color(0x00001F));
    renderer.setSize(canvasWidth ,canvasHeight);

    /*scene.add( new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), new THREE.Vector3(0, 0, 0),1.0,0xff0000));//rouge
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x00ff00));//vert
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x0000ff));//bleu*/

    camera.position.set(-11.5, 0, 0.5);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.Keys = true;

    scene.add(creerPiste());
    scene.add(creerRigoleGauche());
    scene.add(creerRigoleDroite());
    scene.add(creerBouleEquipe1());
    scene.add(creation_quille(-9.5,0.1));
    scene.add(creation_quille(-9.5,0.3));
    scene.add(creation_quille(-9.5,-0.1));
    scene.add(creation_quille(-9.5,-0.3));

    scene.add(creation_quille(-9,0.2));
    scene.add(creation_quille(-9,0));
    scene.add(creation_quille(-9,-0.2));

    scene.add(creation_quille(-8.5,0.1));
    scene.add(creation_quille(-8.5,-0.1));

    scene.add(creation_quille(-8,0));


    function animate() {
        requestAnimationFrame( animate );

        renderer.render( scene, camera );
    }

    animate();

}
init();

function render() {
    stats.update();
    scene.simulate();
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}
function creerPiste() {
    let floorTexture = new THREE.TextureLoader().load('../textures/sol.png');
    let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, clearCoat: 1.0});
    let floorGeometry = new THREE.BoxGeometry(20,1,0.1);
    return new THREE.Mesh(floorGeometry, floorMaterial);
}
function creerRigoleDroite(){
    let gutterSize=0.2;
    let length=20;
    let thickness=0.01;

    let gutterRadius = gutterSize / 2;
    let floorTexture = new THREE.TextureLoader().load('../textures/glow.png');
    let gutterMaterial = new THREE.MeshBasicMaterial({
        clearCoat: 1.0,
        map:floorTexture
    });

    let cutoutBoxGeometry = new THREE.BoxGeometry(gutterSize,length, gutterSize);
    let cutoutBox = new THREE.Mesh(cutoutBoxGeometry, gutterMaterial);
    cutoutBox.position.set(-gutterSize / 2, 0, 0);

    let cutoutCylinderGeometry = new THREE.CylinderGeometry(gutterRadius - thickness, gutterRadius - thickness, length, 20);
    let cutoutCylinder = new THREE.Mesh(cutoutCylinderGeometry, gutterMaterial);
    cutoutCylinder.position.set(0, 1, 0);

    let gutterGeometry = new THREE.CylinderGeometry(gutterRadius, gutterRadius, length, 10);
    let gutterCylinder = new THREE.Mesh(gutterGeometry, gutterMaterial);
    let gutterMesh = ((new ThreeBSP(gutterCylinder)).subtract(new ThreeBSP(cutoutBox)).subtract(new ThreeBSP(cutoutCylinder))).toMesh();
    gutterMesh.geometry.computeVertexNormals();
    let gutter = new THREE.Mesh(gutterMesh.geometry, gutterMaterial, 0);
    gutter.rotation.z = Math.PI/2;
    gutter.rotation.x = -Math.PI/2;
    gutter.position.set(0, 0.6, 0.05);
    return gutter;

}

function creerRigoleGauche(){
    let gutterSize=0.2;
    let length=20;
    let thickness=0.01;

    let gutterRadius = gutterSize / 2;

    let floorTexture = new THREE.TextureLoader().load('../textures/glow.png');
    let gutterMaterial = new THREE.MeshBasicMaterial({
        clearCoat: 1.0,
        map:floorTexture
    });

    let cutoutBoxGeometry = new THREE.BoxGeometry(gutterSize,length, gutterSize);
    let cutoutBox = new THREE.Mesh(cutoutBoxGeometry, gutterMaterial);
    cutoutBox.position.set(-gutterSize / 2, 0, 0);

    let cutoutCylinderGeometry = new THREE.CylinderGeometry(gutterRadius - thickness, gutterRadius - thickness, length, 20);
    let cutoutCylinder = new THREE.Mesh(cutoutCylinderGeometry, gutterMaterial);
    cutoutCylinder.position.set(0, 1, 0);

    let gutterGeometry = new THREE.CylinderGeometry(gutterRadius, gutterRadius, length, 10);
    let gutterCylinder = new THREE.Mesh(gutterGeometry, gutterMaterial);
    let gutterMesh = ((new ThreeBSP(gutterCylinder)).subtract(new ThreeBSP(cutoutBox)).subtract(new ThreeBSP(cutoutCylinder))).toMesh();
    gutterMesh.geometry.computeVertexNormals();
    let gutter = new THREE.Mesh(gutterMesh.geometry, gutterMaterial, 0);
    gutter.rotation.z = Math.PI/2;
    gutter.rotation.x = -Math.PI/2;
    gutter.position.set(0, -0.6, 0.05);
    return gutter;


}

function creerBouleEquipe1(){
    let nbrPoints = 50;
    let R=0.08;
    let sphereGeometry = new THREE.SphereGeometry(R, nbrPoints, nbrPoints);
    let sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(9, 0, 0.13);
    return sphere;


}

function creerBouleEquipe2(){
    let nbrPoints = 50;
    let R=0.08;
    let sphereGeometry = new THREE.SphereGeometry(R, nbrPoints, nbrPoints);
    let sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, 0, 0.13);
    return sphere;


}

function creation_quille(X,Y,bool) { //Permet de créer une quille aux coordonnées (X,Y,0)
    let nbPts = 100;//nbe de pts de la courbe de Bezier
    let epaiB = 5;//epaisseur de la courbe de Bezier
    let nbPtCB = 50;//nombre de points sur la courbe de Bezier
    let nbePtRot = 150;// nbe de points sur les cercles
    let dimPt = 0.02;
    //QUILLE : 38,1 cm de haut, 11,43 cm à l'endroit le plus bombé, 5,7cm à la base.
    //1ère Lathe

    //Points de contrôle et courbe de Bézier
    //20 cm de hauteur, 11 cm de largeur partie milieu haute, 5 cm à la base
    let P0 = new THREE.Vector3(0.1, 0, 0);
    let P1 = new THREE.Vector3(0.06, 0.25, 0);
    let P2 = new THREE.Vector3(0.05, 0.25, 0);
    let P3 = new THREE.Vector3(0, 0.24, 0);
    // tracePt(scene, P0, "#FFFFFF", dimPt, true);
    // tracePt(scene, P1, "#000000", dimPt, true);
    // tracePt(scene, P2, "#008888", dimPt, true);
    // tracePt(scene, P3, "#FF0000", dimPt, true);
    let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3, nbPts, "#FF00FF", epaiB);
    let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "#FFFFFF", 1, false);

    //2ème Lathe
    //Points de contrôle et courbe de Bézier
    let pente1 = (P2.y-P3.y) / (P2.x-P3.x);
    let ord1 = (P2.y) - pente1*(P2.x);
    let C0 = P3;
    let C1 = new THREE.Vector3(-0.1, (pente1*(-0.1)+ord1), 0);
    let C2 = new THREE.Vector3(-0.04, -0.35, 0);
    let C3 = new THREE.Vector3(-0.1,0, 0);
    // tracePt(scene, C1, "#000000", dimPt, true);
    // tracePt(scene, C2, "#008888", dimPt, true);
    // tracePt(scene, C3, "#FF0000", dimPt, true);
    let cbeBez2 = TraceBezierCubique(C0, C1, C2, C3, nbPts, "#FF00FF", epaiB);
    let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#bd6c14", 1, false);

    //3ème Lathe
    //Points de contrôle et courbe de Bézier
    pente1 = (C2.y-C3.y) / (C2.x-C3.x);
    ord1 = (C2.y) - pente1*(C2.x);
    let D0 = C3;
    let D1 = new THREE.Vector3((-0.2 - ord1)/pente1, -0.2, 0);
    let D2 = new THREE.Vector3(0.24, 0.25, 0);
    let D3 = new THREE.Vector3(0, 0.25, 0);
    // tracePt(scene, D1, "#000000", dimPt, true);
    // tracePt(scene, D2, "#008888", dimPt, true);
    // tracePt(scene, D3, "#FF0000", dimPt, true);

    let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FFFFFF", 1, false);
    //Placement des lathes sur la scène
    lathe1.position.set(X, Y, 0.25);
    lathe1.rotation.set(-Math.PI / 2, 0, 0);
    lathe2.position.set(X, Y, 0.25);
    lathe2.rotation.set(-Math.PI/2, 0, 0);
    lathe3.position.set(X, Y, 0.25);
    lathe3.rotation.set(Math.PI/2 , 0, 0);
    let grp = new THREE.Group();
    grp.add(lathe1);
    grp.add(lathe2);
    grp.add(lathe3);
   return grp;
}