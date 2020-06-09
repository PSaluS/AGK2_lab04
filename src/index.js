import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
    window.innerHeight,
    0.1,
    2000
);
let scale = 0.1;
let imgW, imgH = 0;
var controls = new OrbitControls( camera, renderer.domElement );
let geometry;
let vertices = [];
let quad_uvs =
[
0.0, 0.0,
1.0, 0.0,
1.0, 1.0,
0.0, 1.0,
1.0, 1.0,
1.0, 0.0
];
const materialMesh = new THREE.MeshBasicMaterial( { color: 0x00aa00, wireframe: true});
let materialSolid;
let mesh;
let image = new MarvinImage();
let imageValueRed = [];
let imageValueGreen = [];
let imageValueBlue = [];
let viue = 2;

function ToHex(number)
{
  if (number < 0)
  {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toLowerCase();
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  function light() {
    var AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    var PointLight = new THREE.PointLight(0xffffff, 1, 1000);
    PointLight.position.set(0,50,0);
    scene.add(PointLight);
    scene.add(AmbientLight);
  };

function load() {
	if(imageValueRed.length == 0) {
	image.load('./bitmap/teren.png', function () {
		imgH = image.height;
		imgW = image.height;
		for(let i=0; i < (image.width*image.height)*4; i+=2) {
			imageValueRed.push(image.imageData.data[i]);
			i++;
			imageValueGreen.push(image.imageData.data[i]);
			i++;
			imageValueBlue.push(image.imageData.data[i]);
		}
		terren(imageValueRed);
	});
}
}

function terren(value) {

let z=0;
let przes=1;
	for (let i=0 ; i< (imgW*(imgH-1))-1; i++) {

		 if(i != 0 && (i%((imgW*przes)-1)) == 0) {
			 i++;
			 z++;
			 przes++;
			}

		geometry = new THREE.BufferGeometry();
		vertices = new Float32Array( [
			(i)%imgW, value[i]*scale, z,
			(i+1)%imgW, value[i+1+imgW]*scale, z+1,
			(i+1)%imgW, value[i+1]*scale, z,

			(i+1)%imgW, value[i+1+imgW]*scale, z+1,
			(i)%imgW, value[i]*scale, z,
			(i)%imgW, value[i+imgW]*scale, z+1
			 ] );

			 let uvs = new Float32Array( quad_uvs);
			 geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			 geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
			 geometry.computeFaceNormals();
			 geometry.computeVertexNormals();
			 if (viue == 1) {
			 	mesh = new THREE.Mesh( geometry, materialMesh );
			 } if(viue == 2) {
				 let red = value[i];
				 let green = 255 - value[i];
				 let col = new THREE.Color(`rgb(${red}, ${green}, 0)`);
				 materialSolid = new THREE.MeshLambertMaterial( { color: col});
				mesh = new THREE.Mesh( geometry, materialSolid );
			 } if (viue == 3) {
				let blue = imageValueBlue[i];
				let green = imageValueGreen[i];
				let col = new THREE.Color(`rgb(0, ${green}, ${blue})`);
				materialSolid = new THREE.MeshLambertMaterial( { color: col});
			   	mesh = new THREE.Mesh( geometry, materialSolid );
			 } if (viue == 4) {
				 let texLoader = new THREE.TextureLoader();
				//  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				//  texture.repeat.set(32,32);

				 materialSolid = new THREE.MeshBasicMaterial( { map: texLoader.load( './bitmap/Tex.jpg' ) } );
				 mesh = new THREE.Mesh( geometry, materialSolid );
			 }
			 scene.add(mesh);
	}
}

  function init() {
    camera.position.set(64	, 100, 64);
    camera.lookAt(0,0,0);
    scene.add(camera);
    renderer.setSize(
      window.innerWidth,
    	window.innerHeight
      );
      renderer.setClearColor(0x000000, 1);
      document.body.appendChild(renderer.domElement);
	  light();
	  load();
			build();
	}

	function build() {
		terren(imageValueRed);
    render();
	}

	function keyPutDown (event) {
		const keyCode = event.which;
		const arrDash = 0.05;
		switch (keyCode) {
			case(81):
			scale += arrDash;
			ref();
			break;
			case(65):
			scale -= arrDash;
			ref();
			break;
			case(49):
			viue = 1;
			ref();
			break;
			case(50):
			viue = 2;
			ref();
			break;
			case(51):
			viue = 3;
			ref();
			break;
			case(52):
			viue = 4;
			ref();
			break;
		}
		}

		function ref() {
			while(scene.children.length > 3) {
				scene.remove(scene.children[scene.children.length-1]);
			}
			build();
		}

window.onload = init();

document.addEventListener("keydown", keyPutDown);