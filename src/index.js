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
const material = new THREE.MeshBasicMaterial( { color: 0x00aa00, wireframe: true});
let mesh;
let image = new MarvinImage();
let imageValue = [];

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  function light() {
    var AmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
    var DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    DirectionalLight.position.set(0,50,0);
    scene.add(DirectionalLight);
    scene.add(AmbientLight);
  };

function load() {
	if(imageValue.length == 0) {
	image.load('./bitmap/teren.png', function () {
		imgH = image.height;
		imgW = image.height;
		for(let i=0; i < (image.width*image.height)*4; i+=4) {
			imageValue.push(image.imageData.data[i]);
		}
		terren(imageValue);
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
			(i+1)%imgW, value[i+1]*scale, z,
			(i+1)%imgW, value[i+1+imgW]*scale, z+1,

			(i+1)%imgW, value[i+1+imgW]*scale, z+1,
			(i)%imgW, value[i+imgW]*scale, z+1,
			(i)%imgW, value[i]*scale, z
			 ] );
			 geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			 mesh = new THREE.Mesh( geometry, material );
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
		terren(imageValue);
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