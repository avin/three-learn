import React from 'react';
import { connect } from 'react-redux';
import MediaDevices from '../../../lib/mediadevices';
import screenfull from 'screenfull';
import Stats from 'stats.js';

window.THREE = require('three');

require('script-loader!jsartoolkit/build/artoolkit.debug');
require('script-loader!../../../lib/artoolkit/artoolkit.api.js');
require('imports-loader?THREE=three!../../../lib/artoolkit/artoolkit.three');

const ENABLE_FULLSCREEN = true;
//const ENABLE_FULLSCREEN = false;

export class ARScene extends React.Component {

    state = {
        show: false,
        videoDevices: [],
        selectedVideoDevice: null,
    };

    componentDidMount() {
        const devices = MediaDevices.getDevices().then(devs => {
            this.setState({videoDevices: devs.videoInputs});
        });

        // При смене ориантации страницы отработать оповорот
        window.addEventListener("orientationchange", function() {
            console.log(window.orientation);
        }, false);
    }

    handleStart() {
        this.setState({show: true}, () => {
            let orientation = 'landscape';

            //Show FPS-Meter
            var stats = new Stats();
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '';
            stats.dom.style.right = '0px';
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            this.refs.canvasContainer.appendChild(stats.dom);


            if (ENABLE_FULLSCREEN){
                if (screenfull.enabled) {
                    screenfull.request();
                }
            }

            const canvasEl = this.refs.canvas;

            if (ENABLE_FULLSCREEN){
                canvasEl.width = screen.width;
                canvasEl.height = screen.height;
            } else {
                canvasEl.width = window.innerWidth;
                canvasEl.height = window.innerHeight;
            }

            let width = canvasEl.width;
            let height = canvasEl.height;

            //Если пропорции экрана вытянутые - меням ориентацию канвы (artoolkit может работать только с landscape!)
            if (height > width){
                const hBuf = height;
                height = width;
                width = hBuf;
                orientation = 'portrait';
            }

            ARController.getUserMediaThreeScene({
                videoDeviceId: this.state.selectedVideoDevice.id,
                //maxARVideoSize: 320,
                maxARVideoSize: 100,

                //cameraParam: 'assets/Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
                cameraParam: 'assets/Data/camera_para.dat',
                onSuccess: function (arScene, arController, arCamera) {



                    arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
                    const renderer = new THREE.WebGLRenderer({
                        canvas: canvasEl,
                        antialias: false
                    });

                    //Меняем размемы рендера чтоб он полностью помещался в экран
                    let wK = width / arController.videoWidth;
                    let hK = height / arController.videoHeight;

                    let k = (wK > hK) ? hK : wK;

                    width = arController.videoWidth * k;
                    height = arController.videoHeight * k;

                    //Если портретная ориентация - переворачиваем канву и выставляем на середину
                    if (orientation === 'portrait'){
                        const deg = -90;
                        canvasEl.style.webkitTransform = 'rotate('+deg+'deg)';
                        canvasEl.style.mozTransform    = 'rotate('+deg+'deg)';
                        canvasEl.style.msTransform     = 'rotate('+deg+'deg)';
                        canvasEl.style.oTransform      = 'rotate('+deg+'deg)';
                        canvasEl.style.transform       = 'rotate('+deg+'deg)';
                        canvasEl.style.left = `-${(width-height)/2}px`
                    }

                    renderer.setPixelRatio( window.devicePixelRatio );
                    renderer.setSize(width, height);

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

                    const tick = function () {
                        stats.begin();

                        arScene.process();
                        arScene.renderOn(renderer);

                        stats.end();
                        requestAnimationFrame(tick);
                    };
                    tick();
                }
            });

        })
    };

    handleStop = () => {
        cancelAnimationFrame(this.animationId);// Stop the animation
        this.scene = null;
        this.camera = null;

        this.setState({show: false})
    };

    handleSelectVideoDevice = (videoDevice) => {
        this.setState({selectedVideoDevice: videoDevice});

        MediaDevices.startMedia({
            element: this.refs.video,
            videoSource: videoDevice.id,
            audioSource: false
        }).then((res) => {
            console.log('STARTED MEDIA')
        })
    };

    renderVideoDevices() {
        const {videoDevices, selectedVideoDevice} = this.state;
        return (
            <div style={{padding: 10}}>
                Selected video device ID:&nbsp;
                <strong>
                    {selectedVideoDevice ? selectedVideoDevice.label : (<span className="pt-text-muted">NONE</span>)}
                </strong>
                <hr/>
                <div>
                    {videoDevices.map(videoDevice => {
                        return (
                            <div key={videoDevice.id} style={{marginBottom: 10}}>
                                <button
                                    className="pt-button"
                                    onClick={() => this.handleSelectVideoDevice(videoDevice)}>
                                    {videoDevice.label}
                                </button>

                            </div>
                        )
                    })}
                </div>
            </div>
        )

    }

    render() {
        const {show, selectedVideoDevice} = this.state;
        const canvasContainerStyle = {
            position: 'fixed',
            zIndex: 10,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#000000'
        };
        return (
            <div ref="container" style={{position: 'relative'}}>
                <button
                    disabled={!selectedVideoDevice}
                    onClick={() => this.handleStart()}
                    className="pt-button pt-intent-primary pt-large maring-15">
                    START AR
                </button>

                {this.renderVideoDevices()}

                <video ref="video" autoPlay="true"/>

                {show ?
                    <div style={canvasContainerStyle} ref="canvasContainer" onClick={() => {/*this.handleStop()*/
                    }}>
                        <canvas ref="canvas" style={{
                            padding: 0,
                            margin: 'auto',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            //transform: 'rotate(-90deg)'
                        }}/>
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