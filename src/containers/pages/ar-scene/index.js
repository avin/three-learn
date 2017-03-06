import React from 'react';
import { connect } from 'react-redux';
import MediaDevices from '../../../lib/mediadevices';
import screenfull from 'screenfull';
import Stats from 'stats.js';
import classNames from 'classnames';
import annyang from 'annyang';
import TWEEN from 'tween.js';
import isMobile from 'ismobilejs';

window.THREE = require('three');

require('script-loader!jsartoolkit/build/artoolkit.debug');
require('script-loader!../../../lib/artoolkit/artoolkit.api.js');
require('imports-loader?THREE=three!../../../lib/artoolkit/artoolkit.three');
require('imports-loader?THREE=three!../../../lib/artoolkit/artoolkit.three');

THREE.FBXLoader = require('imports-loader?THREE=three!exports-loader?THREE.FBXLoader!three/examples/js/loaders/FBXLoader2');
THREE.AssimpJSONLoader = require('imports-loader?THREE=three!exports-loader?THREE.AssimpJSONLoader!three/examples/js/loaders/AssimpJSONLoader');
THREE.OBJLoader = require('imports-loader?THREE=three!exports-loader?THREE.OBJLoader!three/examples/js/loaders/OBJLoader');
THREE.MTLLoader = require('imports-loader?THREE=three!exports-loader?THREE.MTLLoader!three/examples/js/loaders/MTLLoader');

THREE.VRControls = require('imports-loader?THREE=three!exports-loader?THREE.VRControls!three/examples/js/controls/VRControls');
THREE.VREffect = require('imports-loader?THREE=three!exports-loader?THREE.VREffect!three/examples/js/effects/VREffect');
THREE.StereoEffect = require('imports-loader?THREE=three!exports-loader?THREE.StereoEffect!three/examples/js/effects/StereoEffect');


const ENABLE_FULLSCREEN = isMobile.any; //для всех мобильных устройств включено
const PREVIEW_CAMERA_ON_SELECT = false;

const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

const onError = function (xhr) {
    console.warn(xhr);
};


export class ARScene extends React.Component {

    state = {
        show: false,
        videoDevices: [],
        selectedVideoDevice: null,
        CVQuality: isMobile.any ? 150 : 400,
        contentType: 1,
        effectIsPresenting: false,
        orientation: 'unknown'
    };

    meshes = [];

    constructor(props) {
        super(props);

        //подключаем распознавалку голоса
        console.log(annyang);
        annyang.debug();
        annyang.setLanguage('ru');
    }

    componentDidMount() {
        const devices = MediaDevices.getDevices().then(devs => {
            this.setState({videoDevices: devs.videoInputs});
        });

        // При смене ориантации страницы отработать оповорот
        window.addEventListener("orientationchange", () => {
            //При смене ориентации делаем реинит
            this.handleReInit()
        }, false);
    }

    sceneFill() {
        const {contentType} = this.state;

        const setContent1 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);
            const mesh1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 8, 8),
                new THREE.MeshNormalMaterial()
            );
            mesh1.material.shading = THREE.FlatShading;
            mesh1.position.z = 0.5;
            marker1.add(mesh1);
            this.meshes.push(mesh1);
            this.arScene.scene.add(marker1);
        };

        const setContent2 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);
            const mesh1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16, 16),
                new THREE.MeshPhongMaterial({
                    color: 0xFF0000,
                    shininess: 200,
                    morphTargets: true,
                    vertexColors: THREE.FaceColors,
                    shading: THREE.FlatShading
                })
            );
            mesh1.material.shading = THREE.FlatShading;
            mesh1.position.z = 0.5;
            marker1.add(mesh1);
            this.meshes.push(mesh1);
            this.arScene.scene.add(marker1);
        };

        const setContent3 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);
            const mesh1 = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshPhongMaterial({
                    color: 0xFFFF00,
                    shininess: 200,
                    morphTargets: true,
                    vertexColors: THREE.FaceColors,
                    shading: THREE.FlatShading
                })
            );
            mesh1.material.shading = THREE.FlatShading;
            mesh1.position.z = 0.5;
            marker1.add(mesh1);
            this.meshes.push(mesh1);
            this.arScene.scene.add(marker1);

            //ГОЛОС

            // Add our commands to annyang
            annyang.addCommands({
                'поворот': () => {
                    console.log('FIRE Поворот');
                    new TWEEN.Tween(mesh1.rotation).to({z: mesh1.rotation.z + Math.PI / 2}, 3000)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start();
                },
                'прыжок': () => {
                    const realPositionZ = mesh1.position.z;
                    const tween = new TWEEN.Tween(mesh1.position)
                        .to({z: mesh1.position.z + 1}, 500)
                        .easing(TWEEN.Easing.Exponential.Out);
                    const tweenBack = new TWEEN.Taween(mesh1.position)
                        .to({z: realPositionZ}, 500)
                        .easing(TWEEN.Easing.Exponential.In);


                    tween.chain(tweenBack);
                    tween.start();

                    console.log('FIRE Прыжок');
                },
            });
            annyang.start({
                autoRestart: true,
                continuous: false
            });
        };

        const setContent4 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);

            const manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };


            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.load('assets/models/valve/valve4.mtl', (materials) => {
                materials.preload();
                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('assets/models/valve/valve4.obj', (object) => {

                    //Увеличиваем размеры
                    object.scale.set(10, 10, 10);

                    //Меняем изначальную позицию
                    _.merge(object.position, {
                        y: -1,
                        z: 0.5
                    });
                    //_.merge(object.rotation, {x: Math.PI / 2});

                    this.meshes.push(object);
                    marker1.add(object);
                    this.arScene.scene.add(marker1);
                }, (onProgress, onError ));
            });
        };

        const setContent5 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);

            const manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.load('assets/models/kol/m.mtl', (materials) => {
                materials.preload();
                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('assets/models/kol/m.obj', (object) => {

                    //Увеличиваем размеры
                    object.scale.set(3, 3, 3);

                    //Меняем изначальную позицию
                    _.merge(object.position, {
                        y: -2,
                        z: 0.5
                    });
                    _.merge(object.rotation, {x: Math.PI / 2});
                    _.merge(object.rotation, {y: -Math.PI / 2});
                    _.merge(object.rotation, {z: Math.PI / 2});

                    this.meshes.push(object);
                    marker1.add(object);
                    this.arScene.scene.add(marker1);
                }, (onProgress, onError ));
            });
        };


        const setContent6 = () => {
            const marker1 = this.arController.createThreeBarcodeMarker(20);

            const manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.load('assets/models/boxy/m.mtl', (materials) => {
                materials.preload();
                const objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load('assets/models/boxy/m.obj', (object) => {

                    //Увеличиваем размеры
                    object.scale.set(0.50, 0.50, 0.50);

                    //Меняем изначальную позицию
                    // _.merge(object.position, {
                    //     y: -1,
                    //     z: 0.5
                    // });
                    //_.merge(object.rotation, {x: Math.PI / 2});

                    this.meshes.push(object);
                    marker1.add(object);
                    this.arScene.scene.add(marker1);
                }, (onProgress, onError ));
            });

        };

        switch (contentType) {
            case 1:
                setContent1();
                break;
            case 2:
                setContent2();
                break;
            case 3:
                setContent3();
                break;
            case 4:
                setContent4();
                break;
            case 5:
                setContent5();
                break;
            case 6:
                setContent6();
                break;
        }
    }

    handleStart() {
        this.setState({show: true}, () => {
            let orientation = 'landscape';

            //Show FPS-Meter
            var stats = new Stats();
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '';
            stats.dom.style.right = '0px';
            stats.showPanel(500); // 0: fps, 1: ms, 2: mb, 3+: custom
            this.refs.canvasContainer.appendChild(stats.dom);

            if (ENABLE_FULLSCREEN) {
                if (screenfull.enabled) {
                    screenfull.request();
                }
            }

            const canvasEl = this.refs.canvas;

            if (ENABLE_FULLSCREEN) {
                canvasEl.width = screen.width;
                canvasEl.height = screen.height;
            } else {
                canvasEl.width = window.innerWidth;
                canvasEl.height = window.innerHeight;
            }

            let width = canvasEl.width;
            let height = canvasEl.height;

            //Если пропорции экрана вытянутые - меням ориентацию канвы (artoolkit может работать только с landscape!)
            if (screen.height > screen.width) {
                const hBuf = height;
                height = width;
                width = hBuf;
                orientation = 'portrait';
            }

            ARController.getUserMediaThreeScene({
                videoDeviceId: this.state.selectedVideoDevice.id,
                maxARVideoSize: this.state.CVQuality,

                cameraParam: 'assets/Data/camera_para-iPhone 5 rear 640x480 1.0m.dat',
                //cameraParam: 'assets/Data/camera_para.dat',
                hideMarkerTimeout: 0, //время через которое пропадает визуальный маркер со сцены
                onSuccess: (arScene, arController, arCamera) => {

                    this.arScene = arScene;
                    this.arController = arController;
                    this.arCamera = arCamera;

                    arController.setPatternDetectionMode(artoolkit.AR_MATRIX_CODE_DETECTION);
                    const renderer = this.renderer = new THREE.WebGLRenderer({
                        canvas: canvasEl,
                        antialias: true
                    });

                    //Меняем размемы рендера чтоб он полностью помещался в экран
                    let wK = width / arController.videoWidth;
                    let hK = height / arController.videoHeight;

                    let k = (wK > hK) ? hK : wK;

                    width = arController.videoWidth * k;
                    height = arController.videoHeight * k;

                    //Если портретная ориентация - переворачиваем канву и выставляем на середину
                    if (orientation === 'portrait') {
                        const deg = -90;
                        canvasEl.style.webkitTransform = 'rotate(' + deg + 'deg)';
                        canvasEl.style.mozTransform = 'rotate(' + deg + 'deg)';
                        canvasEl.style.msTransform = 'rotate(' + deg + 'deg)';
                        canvasEl.style.oTransform = 'rotate(' + deg + 'deg)';
                        canvasEl.style.transform = 'rotate(' + deg + 'deg)';
                        canvasEl.style.left = `-${(width - height) / 2}px`
                    }

                    this.setState({orientation});

                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(width, height);
                    renderer.setClearColor (0x111111, .5);


                    const effect = this.effect = new THREE.VREffect(renderer);
                    //const effect = this.effect = new THREE.StereoEffect(renderer);

                    if (navigator.getVRDisplays) {

                        navigator.getVRDisplays()
                            .then(function (displays) {
                                console.log('DISPLAYS', displays);
                                effect.setVRDisplay(displays[0]);
                                //controls.setVRDisplay(displays[0]);
                            })
                            .catch(function () {
                                // no displays
                            });

                        window.addEventListener('vrdisplaypresentchange', (event) => {
                            this.setState({effectIsPresenting: effect.isPresenting});
                        }, false);
                    }

                    //Добавляем свет на сцену
                    var lights = [];
                    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
                    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
                    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

                    lights[0].position.set(0, 200, 0);
                    lights[1].position.set(100, 200, 100);
                    lights[2].position.set(-100, -200, -100);

                    arScene.scene.add(lights[0]);
                    arScene.scene.add(lights[1]);
                    arScene.scene.add(lights[2]);

                    console.log(arScene.scene);
                    // var texture = new THREE.TextureLoader().load( "assets/img/icon-horizontal.png" );
                    // texture.wrapS = THREE.RepeatWrapping;
                    // texture.wrapT = THREE.RepeatWrapping;
                    // texture.repeat.set( 1, 1 );
                    //
                    // arScene.scene.background = texture;

                    //Наполняем содержимым в зависимости от выбранного типа контента
                    this.sceneFill();

                    const tick = () => {
                        stats.begin();

                        arScene.process();

                        arScene.renderOn(renderer, effect);

                        TWEEN.update();

                        stats.end();
                        this.animationId = requestAnimationFrame(tick);
                    };
                    tick();
                }
            });

        })
    };

    //Включить/выключить ВР
    handleChangeVR = () => {
        this.effect.isPresenting ? this.effect.exitPresent() : this.effect.requestPresent();
    };

    handleStop = () => new Promise((resolve, reject) => {
        //Отключить голос
        if (_.isFunction(annyang.stop)) {
            annyang.stop();
        }

        this.animationId && cancelAnimationFrame(this.animationId);// Stop the animation

        this.arScene = null;
        this.arController && this.arController.dispose();
        this.arCamera = null;
        this.renderer && this.renderer.dispose();


        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }


        this.setState({show: false}, resolve)
    });

    handleSelectVideoDevice = (videoDevice) => {
        this.setState({selectedVideoDevice: videoDevice});

        if (PREVIEW_CAMERA_ON_SELECT) {
            MediaDevices.startMedia({
                element: this.refs.video,
                videoSource: videoDevice.id,
                audioSource: false
            }).then((res) => {
                console.log('STARTED MEDIA')
            })
        }

    };

    renderVideoDevices() {
        const {videoDevices, selectedVideoDevice} = this.state;
        return (
            <div>
                Selected video device:&nbsp;
                <strong>
                    {selectedVideoDevice ? selectedVideoDevice.label : (<span className="pt-text-muted">NONE</span>)}
                </strong>
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

    handleReInit = () => {
        console.log('reInit');
        this.handleStop().then(() => this.handleStart());

    };

    handleSetCVQuality = (value) => {
        this.setState({CVQuality: value})
    };

    handleSetContentType = (value) => {
        this.setState({contentType: value}, () => {
            this.handleReInit();
        })
    };

    render() {
        const {show, selectedVideoDevice, CVQuality, contentType, effectIsPresenting, orientation} = this.state;
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
            <div ref="container" style={{position: 'relative'}} className="maring-15">

                <video ref="videoTexture" autoPlay="true" loop playsInline style={{display: 'none'}}>
                    <source src="assets/textures/sintel.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'/>
                    <source src="assets/textures/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'/>
                </video>

                <button
                    disabled={!selectedVideoDevice}
                    onClick={() => this.handleStart()}
                    className="pt-button pt-intent-primary pt-large">
                    START AR
                </button>

                <hr/>

                <div>

                    CVQuality: &nbsp;
                    <div className="controls pt-button-group">
                        {[10, 50, 100, 150, 200, 300, 400, 500].map(quality => (
                            <button
                                key={quality}
                                className={classNames('pt-button', {'pt-intent-success': CVQuality === quality})}
                                onClick={() => this.handleSetCVQuality(quality)}>
                                {quality}
                            </button>
                        ))}

                    </div>
                </div>

                <hr/>

                {this.renderVideoDevices()}

                {PREVIEW_CAMERA_ON_SELECT ?
                    <video ref="video" autoPlay="true"/>
                    : null}

                {show ?
                    <div style={canvasContainerStyle} ref="canvasContainer" onClick={() => {/*this.handleStop()*/
                    }}>
                        <div style={{padding: 20}}>
                            <div className="controls pt-button-group">
                                {[1, 2, 3, 4, 5, 6, 7].map(typeId => (
                                    <button
                                        key={typeId}
                                        className={classNames('pt-button', {'pt-intent-success': typeId === contentType})}
                                        onClick={() => this.handleSetContentType(typeId)}>
                                        <strong>{typeId}</strong>
                                    </button>
                                ))}
                            </div>
                            <br/>
                            <br/>
                            <div className="controls pt-button-group">
                                <button className="pt-button pt-large pt-intent-warning" onClick={this.handleReInit}>
                                    RE-INIT
                                </button>
                                <button className="pt-button pt-large pt-intent-danger" onClick={this.handleStop}>
                                    STOP
                                </button>
                                {orientation === 'landscape' ?
                                    <button
                                        className="pt-button pt-large"
                                        onClick={this.handleChangeVR} style={{}}>
                                        {effectIsPresenting ? 'CLOSE VR' : 'GO VR'}
                                    </button>
                                    : null}
                            </div>
                        </div>

                        <canvas ref="canvas" style={{
                            padding: 0,
                            margin: 'auto',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
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