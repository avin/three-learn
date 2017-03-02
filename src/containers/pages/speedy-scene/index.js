import React from 'react';
import { connect } from 'react-redux';
import Stats from 'stats.js';
const THREE = require('three');

THREE.VRControls = require('imports-loader?THREE=three!exports-loader?THREE.VRControls!three/examples/js/controls/VRControls');
THREE.VREffect = require('imports-loader?THREE=three!exports-loader?THREE.VREffect!three/examples/js/effects/VREffect');
const WEBVR = require('exports-loader?WEBVR!three/examples/js/vr/WebVR');


const ProceduralCity = function () {
    // build the base geometry for each building
    //const geometry = new THREE.CubeGeometry(1, 1, 1);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // translate the geometry to place the pivot point at the bottom instead of the center
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

    // buildMesh
    const buildingMesh = new THREE.Mesh(geometry);

    const cityGeometry = new THREE.Geometry();
    for (let i = 0; i < 20000; i++) {
        // put a random position
        buildingMesh.position.x = Math.floor(Math.random() * 200 - 100) * 10;
        buildingMesh.position.z = Math.floor(Math.random() * 200 - 100) * 10;

        // put a random scale
        buildingMesh.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        buildingMesh.scale.y = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
        buildingMesh.scale.z = buildingMesh.scale.x;

        // merge it with cityGeometry - very important for performance
        buildingMesh.updateMatrix();
        cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
    }

    // build the mesh
    const material = new THREE.MeshLambertMaterial({color: 0x8888ff});
    return new THREE.Mesh(cityGeometry, material);
};


export class SpeedyScene extends React.Component {

    state = {
        effectIsPresenting: false,
    };

    componentDidMount() {
        const canvasEl = this.refs.canvas;
        const rect = canvasEl.getBoundingClientRect();

        canvasEl.width = window.innerWidth - rect.left * 2;
        canvasEl.height = window.innerHeight - rect.top - 4;

        const width = canvasEl.width;
        const height = canvasEl.height;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0025);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasEl
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        const controls = new THREE.VRControls(camera);
        const effect = this.effect = new THREE.VREffect(renderer);

        if (navigator.getVRDisplays) {

            navigator.getVRDisplays()
                .then(function (displays) {
                    console.log(displays);
                    effect.setVRDisplay(displays[0]);
                    controls.setVRDisplay(displays[0]);
                })
                .catch(function () {
                    // no displays
                });

            window.addEventListener('vrdisplaypresentchange', (event) => {
                this.setState({effectIsPresenting: effect.isPresenting});
            }, false);
        }

        //Add light
        const light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
        light.position.set(0.75, 1, 0.25);
        scene.add(light);

        //Plane
        const material = new THREE.MeshBasicMaterial({color: 0x660000});
        const geometry = new THREE.PlaneGeometry(2000, 2000);
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -90 * Math.PI / 180;
        scene.add(plane);

        //Generate and add city
        var city = ProceduralCity();
        scene.add(city);

        let clock = new THREE.Clock();

        var stats = new Stats();
        stats.dom.style.position = 'absolute';
        stats.dom.style.left = '';
        stats.dom.style.right = '0px';
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.refs.container.appendChild(stats.dom);

        const render = () => {
            requestAnimationFrame(render);
            stats.begin();

            controls.update();

            camera.position.x = Math.cos(clock.getElapsedTime() / 7) * 500;
            camera.position.z = Math.sin(clock.getElapsedTime() / 7) * 100;
            camera.position.y = Math.cos(clock.getElapsedTime() / 7) * 50 + 100;

            // camera.lookAt({
            //     x: Math.cos(clock.getElapsedTime() / 30) * 500,
            //     y: 0,
            //     z: Math.cos(clock.getElapsedTime() / 30) * 500,
            // });

            effect.render( scene, camera );

            stats.end();
        };

        render();
    }

    handleChangeVR = () => {
        this.effect.isPresenting ? this.effect.exitPresent() : this.effect.requestPresent();

        console.log(this.effect.isPresenting);
    };

    render() {
        const {effectIsPresenting} = this.state;
        return (
            <div ref="container" style={{position: 'relative'}}>
                <canvas ref="canvas" width={800} height={600}/>
                <button
                    className="pt-button pt-large"
                    onClick={this.handleChangeVR} style={{
                    position: 'absolute',
                    top: 20,
                    left: 20
                }}>
                    {effectIsPresenting ? 'CLOSE VR' : 'GO VR'}
                </button>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(
    mapStateToProps,
    {}
)(SpeedyScene)