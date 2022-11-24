const borneVue=12;//amplitude de deplacement de la camera


function latheBez3(nbePtCbe,nbePtRot,P0,P1,P2,P3,coul,opacite,bolTranspa){
 //let geometry = new THREE.Geometry();
 let p0= new THREE.Vector2(P0.x,P0.y);
 let p1= new THREE.Vector2(P1.x,P1.y);
 let p2= new THREE.Vector2(P2.x,P2.y);
 let p3= new THREE.Vector2(P3.x,P3.y);
 let Cbe3 = new THREE.CubicBezierCurve(p0,p1,p2,p3);
 let points = Cbe3.getPoints(nbePtCbe);
 let latheGeometry = new THREE.LatheGeometry(points,nbePtRot,0,2*Math.PI);
 let lathe = surfPhong(latheGeometry,coul,opacite,bolTranspa,"#223322");
 return lathe;
}// fin latheBez3

 
function init(){
 let stats = initStats();
    // creation de rendu et de la taille
 let rendu = new THREE.WebGLRenderer({ antialias: true });
 rendu.shadowMap.enabled = true;
 let scene = new THREE.Scene();   
 let result;
 let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
 rendu.shadowMap.enabled = true;
 rendu.setClearColor(new THREE.Color(0xFFFFFF));
 rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);
 cameraLumiere(scene,camera);
 lumiere(scene);
 repere(scene);
 //plans contenant deux axes du repere
 //planRepere(scene);
 //plan du sol
  const largPlan = 75;
  const hautPlan = 25;
  const nbSegmentLarg = 30;
  const nbSegmentHaut = 30;
  const PlanSolGeometry = new THREE.PlaneGeometry(largPlan,hautPlan,nbSegmentLarg,nbSegmentHaut);
  const PlanSol = surfPhong(PlanSolGeometry,"#FF2255",1,true,"#335533");
  PlanSol.position.z = -4;
  PlanSol.receiveShadow = true; 
  PlanSol.castShadow = true;
  scene.add(PlanSol);
// fin du plan du sol
  
 let coef = parseFloat(prompt("Valeur de k ? "));
 let origine = new THREE.Vector3(0,0,0);
 let P0 = new THREE.Vector3(0.6,4,0);
 let P1 = new THREE.Vector3(1,1,0);
 let P2 = new THREE.Vector3(2,1,0);
 let P3 = new THREE.Vector3(2.5,0,0);
 let M0 = new THREE.Vector3(P3.x,P3.y,0);
 let M1 = new THREE.Vector3(0,0,0);
 let M2 = new THREE.Vector3(3,-3,0);
 let M3 = new THREE.Vector3(0.5,-2,0);
 let vP2P3 = new THREE.Vector3(0,0,0);
 let vTan2 = new THREE.Vector3(0,0,0);
 vP2P3.subVectors(P3,P2);//P3-P2
 vTan2.addScaledVector(vP2P3,coef);
 M1.addVectors(M0,vTan2);
 //alert(M0.x+"\n"+M0.y);
 let nb=100;//nmbre de pts par courbe
 let epai=2;//epaisseur de la courbe
 let nbPtCB=50;//nombre de points sur la courbe de Bezier
 let nbePtRot=150;// nbe de points sur les cercles
 let dimPt=0.05;
 tracePt(scene, P0, "#008888",dimPt,true);
 tracePt(scene, P1, "#008888",dimPt,true);
 tracePt(scene, P2, "#008888",dimPt,true);
 tracePt(scene, P3, "#880000",dimPt,true);
 tracePt(scene, M1, "#000088",dimPt,true);
 tracePt(scene, M2, "#880088",dimPt,true);
 tracePt(scene, M3, "#880088",dimPt,true);
 let nbPts = 100;//nbe de pts de la courbe de Bezier
 let epaiB = 5;//epaisseur de la courbe de Bezier
 let cbeBez2 = TraceBezierCubique(M0, M1, M2, M3,nbPts,"#0000FF",epaiB);
 let cbeBez1 = TraceBezierCubique(P0, P1, P2, P3,nbPts,"#FF00FF",epaiB);
 //let cbeBez1 = TraceBezierQuadratique(P0, P1, P2, nbPts,"#FF00FF",epaiB);
 scene.add(cbeBez1);
 scene.add(cbeBez2);
 let lathe1 = latheBez3(nbPtCB,nbePtRot,P0,P1,P2,P3,"#884400",1,false);
 let lathe2 = latheBez3(nbPtCB,nbePtRot,M0,M1,M2,M3,"#008844",1,false);
 scene.add(lathe1);
 scene.add(lathe2);
 // partie GUI
    // initialisation des controles gui
 //let gui = new dat.GUI({ autoPlace: true });//interface graphique utilisateur
 
 //********************************************************
 //
 //  D E B U T     M E N U     G U I
 //
 //********************************************************
 let gui = new dat.GUI();//interface graphique utilisateur
  // ajout du menu dans le GUI
 let menuGUI = new function () {
   this.cameraxPos = camera.position.x;
   this.camerayPos = camera.position.y;
   this.camerazPos = camera.position.z;
   this.cameraZoom = 1;
   this.cameraxDir = 0;
   this.camerayDir = 0;
   this.camerazDir = 0;
    
   //pour actualiser dans la scene   
   this.actualisation = function () {
    posCamera();
    reAffichage();
   }; // fin this.actualisation
 }; // fin de la fonction menuGUI
 // ajout de la camera dans le menu
 ajoutCameraGui(gui,menuGUI,camera)
 //ajout du menu pour actualiser l'affichage 
 gui.add(menuGUI, "actualisation");
 menuGUI.actualisation();
 //********************************************************
 //
 //  F I N     M E N U     G U I
 //
 //********************************************************
 renduAnim();
 
  // definition des fonctions idoines
 function posCamera(){
  camera.position.set(menuGUI.cameraxPos*testZero(menuGUI.cameraZoom),menuGUI.camerayPos*testZero(menuGUI.cameraZoom),menuGUI.camerazPos*testZero(menuGUI.cameraZoom));
  camera.lookAt(menuGUI.cameraxDir,menuGUI.camerayDir,menuGUI.camerazDir);
  actuaPosCameraHTML();
 }
 
 function actuaPosCameraHTML(){
  document.forms["controle"].PosX.value=testZero(menuGUI.cameraxPos);
  document.forms["controle"].PosY.value=testZero(menuGUI.camerayPos);
  document.forms["controle"].PosZ.value=testZero(menuGUI.camerazPos); 
  document.forms["controle"].DirX.value=testZero(menuGUI.cameraxDir);
  document.forms["controle"].DirY.value=testZero(menuGUI.camerayDir);
  document.forms["controle"].DirZ.value=testZero(menuGUI.camerazDir);
 } // fin fonction posCamera
  // ajoute le rendu dans l'element HTML
 document.getElementById("webgl").appendChild(rendu.domElement);
   
  // affichage de la scene
 rendu.render(scene, camera);
  
 
 function reAffichage() {
  setTimeout(function () {
   posCamera();
  }, 200);// fin setTimeout(function ()
    // rendu avec requestAnimationFrame
  rendu.render(scene, camera);
 }// fin fonction reAffichage()
 
 
  function renduAnim() {
    stats.update();
    // rendu avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
// ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }
 
} // fin fonction init()