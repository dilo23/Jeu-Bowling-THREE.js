// primitive avec Phong
function surfPhong(geom,coulD,transpa,bolTrans,coulSpe){ 
 let Material = new THREE.MeshPhongMaterial({
   color: coulD,
   opacity: transpa,
   transparent: bolTrans,
   //     wireframe: false,
   specular:coulSpe, 
   flatShading: true,
   side: THREE.DoubleSide,
 });
 let maillage = new THREE.Mesh(geom,Material);
 return maillage;
}//fin fonction surfPhong

//insensible a la lumiere
function surfMateriauBasic(geom,coul){
 let Materiau = new THREE.MeshBasicMaterial({color: coul});
 let maillage = new THREE.Mesh(geom,Materiau);
 return maillage; 
} //fin fonction surfMateriauBasic

//Gouraud
function surfGouraud(geom,coul){
 let Materiau = new THREE.MeshLambertMaterial({color: coul});
 let maillage = new THREE.Mesh(geom,Materiau);
 return maillage; 
 
}// fin fonction surfGouraud

  // primitive en fil de fer
function surfFilDeFer(ObjetGeometrique,coul,tailleFil) {
 let ProprieteFilDeFer = new THREE.MeshBasicMaterial({
  color:coul,
  wireframeLinewidth: tailleFil
 });
 ProprieteFilDeFer.wireframe = true;
 let maillage = new THREE.Mesh(ObjetGeometrique, ProprieteFilDeFer);
 return maillage;
 }// fin fonction surfFilDeFer