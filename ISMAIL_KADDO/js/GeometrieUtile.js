function det(u,v,w){
 let tmp1 = new THREE.Vector3(0,0,0); 
 tmp1.crossVectors(v,w);//cross ne marche plus
 return u.dot(tmp1);
}

function repere(MaScene){ 
    var PointO3 = new THREE.Vector3( 0,0,0 );
    var vecI = new THREE.Vector3( 1, 0, 0 );
    var vecJ = new THREE.Vector3( 0, 1, 0 );
    var vecK = new THREE.Vector3( 0, 0, 1 );
    vecteur(MaScene,PointO3,vecI, 0xFF0000, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecJ, 0x00FF00, 0.25, 0.125 );
    vecteur(MaScene,PointO3,vecK, 0x0000FF, 0.25, 0.125 );
}

//segment AB
function segment(MaScene,A,B,CoulHexa,epai){
 var geometry = new THREE.Geometry();
 geometry.vertices.push(A,B);
 var line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
     color: CoulHexa,
     linewidth: epai,
 }));
 MaScene.add(line );
}

function tracePt(MaScene, P, CoulHexa,dimPt,bol){    
 let sphereGeometry = new THREE.SphereGeometry(dimPt,12,24);
 let  sphereMaterial = new THREE.MeshBasicMaterial({color: CoulHexa });
 let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
 sphere.position.set(P.x,P.y,P.z);
 if (bol) MaScene.add(sphere);
 return sphere;
} // fin function tracePt

var epsilon = 0.00000001;
function testZero(x){
  var val=parseFloat(Number(x).toPrecision(PrecisionArrondi));
  if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi))<epsilon) val=0;
  return val;
}

const PrecisionArrondi=50;

//vecteur normal unitaire a une face
function vecteurProdVec(MaScene,A,u,v,CoulHexa,longCone,RayonCone){
 let w = new THREE.Vector3(0,0,0);
 let C = new THREE.Vector3(0,0,0);
 w.crossVectors(u,v);
 w.normalize();
 C.addVectors(A,w);
 vecteur(MaScene,A,C,CoulHexa,longCone,RayonCone);
}
//vecteur AB qui est une fleche
function vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone){
 var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
 vecAB.normalize();
 MaScene.add( new THREE.ArrowHelper( vecAB, A, B.distanceTo(A), CoulHexa,longCone,RayonCone ));
}

//retour le vecteur AB qui est une fleche sans l'afficher
function vecteurRetroune(MaScene,A,B,CoulHexa,longCone,RayonCone){
 var vecAB = new THREE.Vector3( B.x-A.x, B.y-A.y, B.z-A.z );
 vecAB.normalize();
 return(vecAB);
}

//retour le vecteur  normal unitaire a une face sans l'afficher
function vecteurProdVecRetroune(MaScene,A,u,v,CoulHexa,longCone,RayonCone){
 let w = new THREE.Vector3(0,0,0);
 let C = new THREE.Vector3(0,0,0);
 w.crossVectors(u,v);
 w.normalize();
 //C.addVectors(A,w);
 return(w);
}

//vecteur AB qui est une fleche
function vecteurTan(MaScene,A,vB,CoulHexa,longCone,RayonCone){
 let B = new THREE.Vector3( 0, 0, 0);
 B.addVectors(A,vB);
 vecteur(MaScene,A,B,CoulHexa,longCone,RayonCone);
}


function afficheVecteur(V,nom,lieu){
 var mes = nom+" : (";
 for(var i=0;i<2;i++)
   mes+=V.getComponent(i)+" , ";
 mes+=V.getComponent(2)+" ) <br />";
 document.getElementById(lieu).innerHTML+=mes;
}