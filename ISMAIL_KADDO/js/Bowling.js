let cameraControls;
let canvas = document.getElementById("canvas");
let stats = new Stats();
let clock = new THREE.Clock();
let tabQuilles = [];
let tabPosQuillesX = [-9.5,-9.5,-9.5,-9.5,-9,-9,-9,-8.5,-8.5,-8];
let tabPosQuillesY = [0.1,-0.1,0.3,-0.3,0.2,0,-0.2,0.1,-0.1,0];
let tabPosQuillesBool = ['false','false','false','false','false','false','false','false','false','true'];
let equipe =1;
let boule = creerBoule(10, 0, equipe);
let quilles_tombees = 0;

let canvasWidth = canvas.offsetWidth;
let canvasHeight = canvas.offsetHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(30, canvasWidth / canvasHeight, 1, 1000);
function init() {
    scene.add(boule);
    let renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.setClearColor(new THREE.Color(0XFFFF83));
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;

    /*scene.add( new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0).normalize(), new THREE.Vector3(0, 0, 0),1.0,0xff0000));//rouge
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x00ff00));//vert
    scene.add( new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1).normalize(),new THREE.Vector3(0, 0, 0),1.0,0x0000ff));//bleu*/

    camera.position.set(11.5, 0, 0.5);
    camera.up.set(0, 0, 1);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.Keys = true;


    scene.add(creerPiste());
    scene.add(creerRigole(1));
    scene.add(creerRigole(2));


    //Création quilles
    for (let i = 0; i < 10; i++) {
        tabQuilles.push(creation_quille(tabPosQuillesX[i], tabPosQuillesY[i], i));
        scene.add(tabQuilles[i]);
    }


    function animate() {
        majQuilles();
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.end();

    }

    animate();
}
    //********************************************************
    //
    //  D E B U T     M E N U     G U I
    //
    //********************************************************

    document.body.appendChild(stats.dom)


    let gui = new dat.GUI()

    let para = {
        Y:boule.position.y,};
    let deplacement = gui.addFolder('Déplacement');
    deplacement.add(para,'Y', -0.5, 0.5).step(0.05).onChange(function () {
        boule.position.set(10, para.Y, 0.13);
    });
    deplacement.open();


    //********************************************************
    //
    //  F I N     M E N U     G U I
    //
    //*********************************************************

    function render() {
        stats.update();
        renderer.render(scene, camera);

    }
    function creerPiste() {
        let floorTexture = new THREE.TextureLoader().load('../textures/sol.png');
        let floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture});
        let floorGeometry = new THREE.BoxGeometry(20,1,0.1);
        return new THREE.Mesh(floorGeometry, floorMaterial);
    }

    function creerRigole(pos){ //pos 1 pour = rigole gauche; pos 2 =  rigole droite
        let gutterSize=0.2;
        let length=20;
        let thickness=0.01;

        let gutterRadius = gutterSize / 2;
        let floorTexture = new THREE.TextureLoader().load('../textures/glow.png');
        let gutterMaterial = new THREE.MeshBasicMaterial({
            clearCoat: 1.0,
            map:floorTexture,
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
        if(pos===1)
            gutter.position.set(0, -0.6, 0.05);
        else
            gutter.position.set(0, 0.6, 0.05);

        return gutter;

    }

    function creerBoule(x,y,equipe){

        let couleurSphere;
        let couleurCercle;
        if(equipe===1){
            couleurSphere = new THREE.Color(0xff0000);
            couleurCercle = new THREE.Color(0x0000ff);
        }
        else if(equipe===2){ {
            couleurSphere = new THREE.Color(0x0000ff);
            couleurCercle = new THREE.Color(0xff0000);
        }}
        let nbrPoints = 50;
        let R=0.08;
        let sphereGeometry = new THREE.SphereGeometry(R, nbrPoints, nbrPoints);
        let sphereMaterial = new THREE.MeshBasicMaterial({color: couleurSphere});
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

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
        let groupe = new THREE.Group();
        groupe.name="boule";
        groupe.add(sphere);
        groupe.add(cercle);
        groupe.position.set(x, y, 0.13);

        return groupe;


    }
    function creation_quille(X,Y,i) { //Permet de créer une quille aux coordonnées (X,Y,0)
        let nbPtCB = 50;//nombre de points sur la courbe de Bezier
        let nbePtRot = 50;// nbe de points sur les cercles

        //1ère Lathe
        //Points de contrôle et courbe de Bézier
        //20 cm de hauteur, 11 cm de largeur partie milieu haute, 5 cm à la base
        let P0 = new THREE.Vector3(0.05, 0, 0);
        let P1 = new THREE.Vector3(0.03, 0.13, 0);
        let P2 = new THREE.Vector3(0.025, 0.13, 0);
        let P3 = new THREE.Vector3(0, 0.12, 0);
        let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, "0xFF0000", 1, false);

        //2ème Lathe
        //Points de contrôle et courbe de Bézier
        let pente1 = (P2.y-P3.y) / (P2.x-P3.x);
        let ord1 = (P2.y) - pente1*(P2.x);
        let C0 = P3;
        let C1 = new THREE.Vector3(-0.04, (pente1*(-0.005)+ord1), 0);
        let C2 = new THREE.Vector3(-0.02, -0.18, 0);
        let C3 = new THREE.Vector3(-0.05,0, 0);
        let lathe2 = latheBez3(nbPtCB, nbePtRot, C0, C1, C2, C3, "0xFF0000", 1, false);

        //3ème Lathe
        //Points de contrôle et courbe de Bézier
        pente1 = (C2.y-C3.y) / (C2.x-C3.x);
        ord1 = (C2.y) - pente1*(C2.x);
        let D0 = C3;
        let D1 = new THREE.Vector3((-0.1 - ord1)/pente1, -0.1, 0);
        let D2 = new THREE.Vector3(0.12, 0.13, 0);
        let D3 = new THREE.Vector3(0, 0.13, 0);
        let lathe3 = latheBez3(nbPtCB, nbePtRot, D0, D1, D2, D3, "0xFF0000", 1, false);



        //Placement des lathes sur la scène
        lathe1.position.set(X, Y, 0.17);
        lathe1.rotation.set(-Math.PI / 2, 0, 0);
        lathe1.color = lathe2.position.set(X, Y, 0.17);
        lathe2.rotation.set(-Math.PI/2, 0, 0);
        lathe3.position.set(X, Y, 0.17);
        lathe3.rotation.set(Math.PI/2 , 0, 0);
        let grp = new THREE.Group();
        grp.add(lathe1);
        grp.add(lathe2);
        grp.add(lathe3);
        grp.name="quille"+i;

        return grp;
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function lancerBoule(x,y) {
        if(x<=-7){
            for (let i=0;i<10;i++){
                let dist = Math.sqrt(Math.pow((x-tabPosQuillesX[i]),2)+Math.pow((y-tabPosQuillesY[i]),2));
                if(dist<0.3){
                    tabPosQuillesBool[i]=true;
                }
            }
        }

        if(x>-10){
            boule.position.x-=0.1;
            boule.children[1].rotation.x-=0.15;
            sleep(5).then(() => {
                lancerBoule(boule.position.x,boule.position.y);
            });
        }
        else {
            quilles_tombees = compterQuilles() - quilles_tombees;
            let mod= tour%2;
            if(mod===0){
                if(quilles_tombees===10){
                    tabCel[tour].innerHTML = "X";
                    tabCel[tour+1].innerHTML = "-";
                    alert("Strike");
                    if(tour===0){
                        tabCel[8].innerHTML = "30";
                    }
                    else if(tour===2){
                        tabCel[10].innerHTML = "30";
                    }
                    else if(tour===4){
                        tabCel[9].innerHTML = "30";
                    }
                    else if(tour===6){
                        tabCel[11].innerHTML = "30";
                    }
                    remiseAzero(equipe);
                    tour= tour+2;
                }
                else{
                    tabCel[tour].innerHTML = quilles_tombees.toString();
                    tour= tour+1;
                    boule.position.set(10, 0, 0.13);

                }


            }
            else if (mod===1) {
                if(compterQuilles()===10){
                    alert("Spare");
                    tabCel[tour].innerHTML = "-";
                    if(tour===1){
                        tabCel[8].innerHTML ="15" ;
                    }
                    else if(tour===3){
                        tabCel[10].innerHTML = "15";
                    }
                    else if(tour===5){
                        tabCel[9].innerHTML = "15";
                    }
                    else if(tour===7){
                        tabCel[11].innerHTML = "15";
                    }
                    tour= tour+1;
                     changerEquipe();
                     remiseAzero(equipe);
                }
                else{
                    tabCel[tour].innerHTML = quilles_tombees.toString();

                    boule.position.set(10, 0, 0.13);
                    if(tour===1){
                        tabCel[8].innerHTML =score(tour,tour-1).toString() ;
                    }
                    else if(tour===3){
                        tabCel[10].innerHTML = score(tour,tour-1).toString();
                    }
                    else if(tour===5){
                        tabCel[9].innerHTML = score(tour,tour-1).toString();
                    }
                    else if(tour===7){
                        tabCel[11].innerHTML = score(tour,tour-1).toString();
                        alert("Fin du jeu");
                        finJeu();
                    }
                    changerEquipe();
                    tour= tour+1;
                    remiseAzero(equipe);
                }


            }
            sleep(3000).then(() => {
            });
        }


        /*if (x <= -7) {
            for (let i = 0; i < 10; i++) {
                let dist = Math.sqrt(Math.pow((x - tabPosQuillesX[i]), 2) + Math.pow((y - tabPosQuillesY[i]), 2));
                if (dist < 0.15) {
                    tabPosQuillesBool[i] = true;
                }
            }
        }
        while (x > -10) {

            boule.children[1].rotation.x -= 0.15;
            sleep(5).then(() => {
                boule.position.x -= 0.1;
            });

        }*/
    }


    function majQuilles(){
        let selectedObject;

        for(let i =0; i<10;i++) {
            if (tabPosQuillesBool[i] === true) {
                selectedObject = scene.getObjectByName(tabQuilles[i].name);
                scene.remove(selectedObject);
            }

        }

    }

let tourEquipe = document.getElementById("tourEquipe");
tourEquipe.textContent = "Tour de l'équipe " + equipe;
let tabCellules = ["c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12"];
let tabCel=[document.getElementById("c1"),document.getElementById("c2"),document.getElementById("c3"),document.getElementById("c4"),document.getElementById("c5"),document.getElementById("c6"),document.getElementById("c7"),document.getElementById("c8"),document.getElementById("c9"),document.getElementById("c10"),document.getElementById("c11"),document.getElementById("c12")];
let tour =0;
function compterQuilles(){
    let compteur = 0;
    for(let i=0;i<10;i++){
        if (tabPosQuillesBool[i] === true) {
            compteur++;
        }
    }
    return compteur;
}
function lancerClick()
{

    lancerBoule(boule.position.x,boule.position.y,tabCellules[tour]);

}
function remiseAzero(equipe){
    for(let i=0;i<10;i++){
        tabPosQuillesBool[i]=false;
        let selectedObject = scene.getObjectByName(tabQuilles[i].name);
        scene.remove(selectedObject);
    }
    //Création quilles
    for (let i = 0; i < 10; i++) {
        tabQuilles.push(creation_quille(tabPosQuillesX[i], tabPosQuillesY[i], i));
        scene.add(tabQuilles[i]);
    }
    scene.remove(scene.getChildByName("boule"));
    boule = creerBoule(10, 0, equipe);
    scene.add(boule);

    quilles_tombees = 0;
    tourEquipe.textContent = "Tour de l'équipe " + equipe.toString();
}
function changerEquipe(){
    if(equipe===1){
        equipe=2;
    }
    else{
        equipe=1;
    }
    return equipe;
}
function score(a,b){
    return parseInt(tabCel[a].textContent)+parseInt(tabCel[b].textContent);
}
function finJeu(){
    document.querySelector('#lancer').disabled = true;
    let score1 = parseInt(tabCel[8].textContent)+parseInt(tabCel[9].textContent);
    let score2 = parseInt(tabCel[10].textContent)+parseInt(tabCel[11].textContent);
    remiseAzero(1)
    if(score1>score2){
        document.getElementById("tourEquipe").textContent = "L'équipe 1 a gagné";
        alert("L'équipe 1 a gagné");

    }
    else if(score1<score2){
        document.getElementById("tourEquipe").textContent = "L'équipe 2 a gagné";
        alert("L'équipe 2 a gagné");

    }
    else {
        document.getElementById("tourEquipe").textContent = "Il y a égalité entre les deux équipes";
        alert("Egalité");
    }

}
