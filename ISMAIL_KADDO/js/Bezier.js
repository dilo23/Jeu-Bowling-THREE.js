
function fact(n){
	if (n>1)
		return n*fact(n-1);
		else return 1;
}

function Ber(t1,i,n) {
  var val=0;
  switch(i){
    case 0 :  val=Math.pow(1.-t1,n);
              break;
    case n :  val=Math.pow(t1,n);
              break;
    default : val=(fact(n)/fact(i)/fact(n-i)*Math.pow(1.-t1,n-i)*Math.pow(t1,i));
  }
  val=testZero(val);
 	return val.toPrecision(PrecisionArrondi);
}

//exercice 3
function BezTab(MaScene,nb,tabPt,CoulHexa,epai){
  let geometry = new THREE.Geometry();
  let points = new Array(nb+1);
  for(var k=0;k<=nb;k++){//k=5;
    let t2=k/nb; 
    t2=t2.toPrecision(PrecisionArrondi);
    let v0= new THREE.Vector3(0,0,0);
    v0.addScaledVector(tabPt[0],Ber(t2,0,tabPt.length-1));
    for(var j=1;j<tabPt.length;j++){
      let v1= new THREE.Vector3(0,0,0);
      v1.addScaledVector(tabPt[j],Ber(t2,j,tabPt.length-1));
      v0.add(v1); 
    }
    geometry.vertices.push(v0);
    points[k] = new THREE.Vector2(v0.x,v0.y );
  } 
  let line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
     color: CoulHexa,
     linewidth: epai
 }));
 return points;
} // fin function BezTab

// exercice 4, animation
function PtSurBez2(P0,P1,P2,t2){
  let v0= new THREE.Vector3(0,0,0);
  let v1= new THREE.Vector3(0,0,0);
  let v2= new THREE.Vector3(0,0,0);
  v0.addScaledVector(P0,Ber(t2,0,2));
  v1.addScaledVector(P1,Ber(t2,1,2));
  v2.addScaledVector(P2,Ber(t2,2,2));
  v0.add(v1);
  v0.add(v2);
  return v0;
} // fin function PtSurBez2


// exercice 2
function traceBezierTab(tabPt,nb,CoulHexa,epai){
  let points = new Array(nb+1);
  for(var k=0;k<=nb;k++){//k=5;
    let t2=k/nb; 
    t2=t2.toPrecision(PrecisionArrondi);
    let v0= new THREE.Vector3(0,0,0);
    v0.addScaledVector(tabPt[0],Ber(t2,0,tabPt.length-1));
    for(var j=1;j<tabPt.length;j++){
      let v1= new THREE.Vector3(0,0,0);
      v1.addScaledVector(tabPt[j],Ber(t2,j,tabPt.length-1));
      v0.add(v1); 
    }
    points[k] = new THREE.Vector3(v0.x,v0.y,0);
  }
 let geometry = new THREE.BufferGeometry().setFromPoints(points);
 let material = new THREE.LineBasicMaterial( { color:CoulHexa,
     linewidth: epai  } );
 let line = new THREE.Line( geometry, material );
 return line;
}


//exercice 4
function TraceBezierQuadratique(P0, P1, P2, nbPts,coul,epaiCbe){
 let cbeBez = new THREE.QuadraticBezierCurve3(P0, P1, P2);
 let cbeGeometry = new THREE.Geometry();
 cbeGeometry.vertices = cbeBez.getPoints(nbPts);
 let material = new THREE.LineBasicMaterial( 
   { color : coul , 
     linewidth: epaiCbe    
   } );
 let BezierQuadratique = new THREE.Line( cbeGeometry, material );
 return (BezierQuadratique);
}  // fin fonction THREE.QuadratiBezierCurve


//exercice 1
function TraceBezierCubique(P0, P1, P2, P3,nbPts,coul,epaiCbe){
 let cbeBez = new THREE.CubicBezierCurve3(P0, P1, P2, P3);
 let Points = cbeBez.getPoints(nbPts);
 let cbeGeometry = new THREE.BufferGeometry().setFromPoints(Points);
 let material = new THREE.LineBasicMaterial( 
   { color : coul , 
     linewidth: epaiCbe    
   } );
 let BezierCubique = new THREE.Line( cbeGeometry, material );
 return (BezierCubique);
}  // fin fonction THREE.CubicBezierCurve
//********************************************************
//
//     D E    C A S T E L J A U
//
//*********************************************************
// pour tester De Casteljau sans recursivite
function DeCasteljau2(MaScene,P0,P1,P2,t2,CoulHexa,dimPt){
 let v0a= new THREE.Vector3(0,0,0);
 let v0b= new THREE.Vector3(0,0,0);
 let v1a= new THREE.Vector3(0,0,0);
 let v1b= new THREE.Vector3(0,0,0);
 let Q0= new THREE.Vector3(0,0,0);
 let Q1= new THREE.Vector3(0,0,0);
 let R0= new THREE.Vector3(0,0,0);
 v0a.addScaledVector(P0,1-t2);
 v0b.addScaledVector(P1,t2);
 Q0.addVectors(v0a,v0b);
 v1a.addScaledVector(P1,1-t2);
 v1b.addScaledVector(P2,t2);
 Q1.addVectors(v1a,v1b);
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(Q0,1-t2);
 v0b.addScaledVector(Q1,t2);
 R0.addVectors(v0a,v0b); 
 tracePt(MaScene, R0, CoulHexa,dimPt,true);
} // fin function DeCasteljau2


function DeCasteljau3(MaScene,P0,P1,P2,P3,t2,CoulHexa,dimPt){
 let v0a= new THREE.Vector3(0,0,0);
 let v0b= new THREE.Vector3(0,0,0);
 let v1a= new THREE.Vector3(0,0,0);
 let v1b= new THREE.Vector3(0,0,0);
 let v2a= new THREE.Vector3(0,0,0);
 let v2b= new THREE.Vector3(0,0,0);
 let Q0= new THREE.Vector3(0,0,0);
 let Q1= new THREE.Vector3(0,0,0);
 let Q2= new THREE.Vector3(0,0,0);
 let R0= new THREE.Vector3(0,0,0);
 let R1= new THREE.Vector3(0,0,0);
 let S0= new THREE.Vector3(0,0,0);
 v0a.addScaledVector(P0,1-t2);
 v0b.addScaledVector(P1,t2);
 Q0.addVectors(v0a,v0b);
 v1a.addScaledVector(P1,1-t2);
 v1b.addScaledVector(P2,t2);
 Q1.addVectors(v1a,v1b);
 v2a.addScaledVector(P2,1-t2);
 v2b.addScaledVector(P3,t2);
 Q2.addVectors(v2a,v2b);
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(Q0,1-t2);
 v0b.addScaledVector(Q1,t2);
 R0.addVectors(v0a,v0b);    
 v1a.multiplyScalar(0);
 v1b.multiplyScalar(0);
 v1a.addScaledVector(Q1,1-t2);
 v1b.addScaledVector(Q2,t2);
 R1.addVectors(v1a,v1b);  
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(R0,1-t2);
 v0b.addScaledVector(R1,t2); 
 S0.addVectors(v0a,v0b);  
 tracePt(MaScene, S0, CoulHexa,dimPt,true);
} // fin function DeCasteljau3

//versions recursives
function DeCasteljau2R(MaScene,P0,P1,P2,t2,nbrRec,dimPt,n){
 let v0a= new THREE.Vector3(0,0,0);
 let v0b= new THREE.Vector3(0,0,0);
 let v1a= new THREE.Vector3(0,0,0);
 let v1b= new THREE.Vector3(0,0,0);
 let Q0= new THREE.Vector3(0,0,0);
 let Q1= new THREE.Vector3(0,0,0);
 let R0= new THREE.Vector3(0,0,0);
 v0a.addScaledVector(P0,1-t2);
 v0b.addScaledVector(P1,t2);
 Q0.addVectors(v0a,v0b);
 v1a.addScaledVector(P1,1-t2);
 v1b.addScaledVector(P2,t2);
 Q1.addVectors(v1a,v1b);
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(Q0,1-t2);
 v0b.addScaledVector(Q1,t2);
 R0.addVectors(v0a,v0b);
 let Coul="rgb("+Math.ceil(255*n/nbrRec)+","+Math.ceil(255*(1-n/nbrRec))+",125)";
 tracePt(MaScene, R0, Coul,dimPt,true);
 if (n>0){
  DeCasteljau2R(MaScene,P0,Q0,R0,t2,nbrRec,dimPt,n-1);
  DeCasteljau2R(MaScene,R0,Q1,P2,t2,nbrRec,dimPt,n-1);
 }
} // fin function DeCasteljau2R


function DeCasteljau3R(MaScene,P0,P1,P2,P3,t2,nbrRec,dimPt,n){
 let v0a= new THREE.Vector3(0,0,0);
 let v0b= new THREE.Vector3(0,0,0);
 let v1a= new THREE.Vector3(0,0,0);
 let v1b= new THREE.Vector3(0,0,0);
 let v2a= new THREE.Vector3(0,0,0);
 let v2b= new THREE.Vector3(0,0,0);
 let Q0= new THREE.Vector3(0,0,0);
 let Q1= new THREE.Vector3(0,0,0);
 let Q2= new THREE.Vector3(0,0,0);
 let R0= new THREE.Vector3(0,0,0);
 let R1= new THREE.Vector3(0,0,0);
 let S0= new THREE.Vector3(0,0,0);
 v0a.addScaledVector(P0,1-t2);
 v0b.addScaledVector(P1,t2);
 Q0.addVectors(v0a,v0b);
 v1a.addScaledVector(P1,1-t2);
 v1b.addScaledVector(P2,t2);
 Q1.addVectors(v1a,v1b);
 v2a.addScaledVector(P2,1-t2);
 v2b.addScaledVector(P3,t2);
 Q2.addVectors(v2a,v2b);
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(Q0,1-t2);
 v0b.addScaledVector(Q1,t2);
 R0.addVectors(v0a,v0b);    
 v1a.multiplyScalar(0);
 v1b.multiplyScalar(0);
 v1a.addScaledVector(Q1,1-t2);
 v1b.addScaledVector(Q2,t2);
 R1.addVectors(v1a,v1b);  
 v0a.multiplyScalar(0);
 v0b.multiplyScalar(0);
 v0a.addScaledVector(R0,1-t2);
 v0b.addScaledVector(R1,t2); 
 S0.addVectors(v0a,v0b);  
 let Coul="rgb("+Math.ceil(255*n/nbrRec)+","+Math.ceil(255*(1-n/nbrRec))+",125)";
 tracePt(MaScene, S0, Coul,dimPt,true);
 if (n>0){
  DeCasteljau3R(MaScene,P0,Q0,R0,S0,t2,nbrRec,dimPt,n-1);
  DeCasteljau3R(MaScene,S0,R1,Q2,P3,t2,nbrRec,dimPt,n-1);
 }
} // fin function DeCasteljau3R