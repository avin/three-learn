import React from 'react';
import { connect } from 'react-redux';

window.THREE = require('three');


require('script-loader!jsartoolkit/build/artoolkit.debug');
require('script-loader!../../../lib/artoolkit/artoolkit.api.js');
require('imports-loader?THREE=three!../../../lib/artoolkit/artoolkit.three');


export class ARScene extends React.Component {

    state = {
        show: false,
    };

    handleStart() {
        this.setState({show: true}, () => {

            const canvasEl = this.refs.canvas;

            const rect = canvasEl.getBoundingClientRect();

            canvasEl.width = window.innerWidth;
            canvasEl.height = window.innerHeight;

            const width = canvasEl.width;
            const height = canvasEl.height;


            ARController.getUserMediaThreeScene({maxARVideoSize: 320, cameraParam: 'assets/Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
                onSuccess: function(arScene, arController, arCamera) {
                    document.body.className = arController.orientation;
                    arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
                    const renderer = new THREE.WebGLRenderer({antialias: true});
                    if (arController.orientation === 'portrait') {
                        const w = (window.innerWidth / arController.videoHeight) * arController.videoWidth;
                        const h = window.innerWidth;
                        renderer.setSize(w, h);
                        renderer.domElement.style.paddingBottom = (w-h) + 'px';
                    } else {
                        if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
                            renderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);
                        } else {
                            renderer.setSize(arController.videoWidth, arController.videoHeight);
                            document.body.className += ' desktop';
                        }
                    }
                    document.body.insertBefore(renderer.domElement, document.body.firstChild);
                    // See /doc/patterns/Matrix code 3x3 (72dpi)/20.png
                    const markerRoot = arController.createThreeBarcodeMarker(20);
                    const sphere = new THREE.Mesh(
                        new THREE.SphereGeometry(0.5, 8, 8),
                        new THREE.MeshNormalMaterial()
                    );
                    sphere.material.shading = THREE.FlatShading;
                    sphere.position.z = 0.5;
                    markerRoot.add(sphere);
                    arScene.scene.add(markerRoot);
                    let rotationV = 0;
                    let rotationTarget = 0;
                    renderer.domElement.addEventListener('click', function(ev) {
                        ev.preventDefault();
                        rotationTarget += 1;
                    }, false);
                    const tick = function() {
                        arScene.process();
                        arScene.renderOn(renderer);
                        rotationV += (rotationTarget - sphere.rotation.z) * 0.05;
                        sphere.rotation.z += rotationV;
                        rotationV *= 0.8;
                        requestAnimationFrame(tick);
                    };
                    tick();
                }});

        })
    };

    handleStop = () => {
        cancelAnimationFrame(this.animationId);// Stop the animation
        this.scene = null;
        this.camera = null;

        this.setState({show: false})
    };

    render() {
        const {show} = this.state;
        const canvasContainerStyle = {
            position: 'fixed',
            zIndex: 10,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
        };
        return (
            <div ref="container" style={{position: 'relative'}}>
                <button onClick={() => this.handleStart()} className="pt-button pt-intent-primary pt-large maring-15">START AR</button>

                {show ?
                    <div style={canvasContainerStyle} ref="canvasContainer" onClick={() => {/*this.handleStop()*/}}>
                        <canvas ref="canvas" width={800} height={600}/>
                    </div>
                    : null}
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
)(ARScene)