let cameraControls;
let canvas = document.getElementById("canvas");
let stats = new Stats();
let clock = new THREE.Clock();
let canvasWidth = canvas.offsetWidth;
let canvasHeight = canvas.offsetHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 30, canvasWidth / canvasHeight, 1, 1000 );
function init() {

    let renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.setClearColor(new THREE.Color(0XFFFFFF));
    renderer.setSize(canvasWidth ,canvasHeight);

    /*scene.add( new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), new THREE.Vector3(0, 0, 0),1.0,0xff0000));//rouge
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x00ff00));//vert
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x0000ff));//bleu*/

    camera.position.set(11.5, 0, 0.5);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.Keys = true;

    scene.add(creerPiste());
    scene.add(creerRigoleGauche());
    scene.add(creerRigoleDroite());

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


//********************************************************
//
//  D E B U T     M E N U     G U I
//
//********************************************************

    let gui = new dat.GUI();
    let menuGUI = { // les variables du menu
        x: 0};
    gui.add(menuGUI, 'Positition boule', -10, 10);
    let x=gui.add(menuGUI, 'x', -10, 10).listen();
    alert(x);

//********************************************************
//
//  F I N     M E N U     G U I
//
//*********************************************************


function render() {
    stats.update();
    scene.simulate();
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}
function creerPiste() {
    let floorTexture = new THREE.TextureLoader().load('../textures/sol.png');
    let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture});
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

function creerBoule(x,y,equipe){
    let couleurSphere;
    let couleurCercle;
    if(equipe==1){
        couleurSphere = new THREE.Color(0xff0000);
        couleurCercle = new THREE.Color(0x0000ff);
    }
    else {
        couleurSphere = new THREE.Color(0x0000ff);
        couleurCercle = new THREE.Color(0xff0000);
    }
    let nbrPoints = 50;
    let R=0.08;
    let sphereGeometry = new THREE.SphereGeometry(R, nbrPoints, nbrPoints);
    let sphereMaterial = new THREE.MeshBasicMaterial({color: couleurSphere});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(x, y, 0.13);
    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({ color: couleurCercle });

    for (let i = 0; i <= nbrPoints; i++) {
        let t = (i / nbrPoints) * Math.PI * 2;
        geometry.vertices.push(
            new THREE.Vector3(
                Math.cos(t) * R,
                Math.sin(t) * R,
                0));
    }

    let cercle = new THREE.Line(geometry, material);
    cercle.position.set(x, y, 0.12);
    let groupe = new THREE.Group();
    groupe.name="boule";
    groupe.add(sphere);
    groupe.add(cercle);
    return groupe;


}

function creation_quille(X,Y) { //Permet de créer une quille aux coordonnées (X,Y,0)
    let nbPtCB = 50;//nombre de points sur la courbe de Bezier
    let nbePtRot = 150;// nbe de points sur les cercles

    //1ère Lathe
    //Points de contrôle et courbe de Bézier
    //20 cm de hauteur, 11 cm de largeur partie milieu haute, 5 cm à la base
    let P0 = new THREE.Vector3(0.05, 0, 0);
    let P1 = new THREE.Vector3(0.03, 0.13, 0);
    let P2 = new THREE.Vector3(0.025, 0.13, 0);
    let P3 = new THREE.Vector3(0, 0.12, 0);
    let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "#FF0000", 1, false);

    //2ème Lathe
    //Points de contrôle et courbe de Bézier
    let pente1 = (P2.y-P3.y) / (P2.x-P3.x);
    let ord1 = (P2.y) - pente1*(P2.x);
    let C0 = P3;
    let C1 = new THREE.Vector3(-0.04, (pente1*(-0.005)+ord1), 0);
    let C2 = new THREE.Vector3(-0.02, -0.18, 0);
    let C3 = new THREE.Vector3(-0.05,0, 0);
    let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "#FF0000", 1, false);

    //3ème Lathe
    //Points de contrôle et courbe de Bézier
    pente1 = (C2.y-C3.y) / (C2.x-C3.x);
    ord1 = (C2.y) - pente1*(C2.x);
    let D0 = C3;
    let D1 = new THREE.Vector3((-0.1 - ord1)/pente1, -0.1, 0);
    let D2 = new THREE.Vector3(0.12, 0.13, 0);
    let D3 = new THREE.Vector3(0, 0.13, 0);
    let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "#FF0000", 1, false);



    //Placement des lathes sur la scène
    lathe1.position.set(X, Y, 0.17);
    lathe1.rotation.set(-Math.PI / 2, 0, 0);
    lathe2.position.set(X, Y, 0.17);
    lathe2.rotation.set(-Math.PI/2, 0, 0);
    lathe3.position.set(X, Y, 0.17);
    lathe3.rotation.set(Math.PI/2 , 0, 0);
    let grp = new THREE.Group();
    grp.add(lathe1);
    grp.add(lathe2);
    grp.add(lathe3);

   return grp;
}
// sleep time expects milliseconds
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function lancerBoule(x,y,equipe) {

        if (x > -10) {
            sleep(25).then(() => {
                boule = creerBoule(x - 0.5, y,equipe);
                scene.remove(scene.getObjectByName("boule"));
                scene.add(boule);
                lancerBoule(x - 0.5, y);
            });
        }


}

function jeu(){
    let boule = creerBoule(10,0,1);
    scene.add(boule);
    alert("C'est le tour de l'équipe 1");
}

