import React from 'react';
import { connect } from 'react-redux';

const THREE = require('three');
THREE.VRControls = require('imports-loader?THREE=three!exports-loader?THREE.VRControls!three/examples/js/controls/VRControls');
THREE.VREffect = require('imports-loader?THREE=three!exports-loader?THREE.VREffect!three/examples/js/effects/VREffect');
const WEBVR = require('exports-loader?WEBVR!three/examples/js/vr/WebVR');

console.log(WEBVR);


export class VRScene extends React.Component {

    state = {
        show: false,
    };

    handleStart() {
        this.setState({show: true}, () => {
            if ( WEBVR.isAvailable() === false ) {

                document.body.appendChild( WEBVR.getMessage() );

            }

            const canvasEl = this.refs.canvas;

            const rect = canvasEl.getBoundingClientRect();

            canvasEl.width = window.innerWidth;
            canvasEl.height = window.innerHeight;

            const width = canvasEl.width;
            const height = canvasEl.height;

            //===========================
            //===========================
            //===========================

            var clock = new THREE.Clock();

            var container;
            var camera, scene, raycaster, renderer;
            var effect, controls;

            var room;
            var isMouseDown = false;

            var INTERSECTED;
            var crosshair;

            init();
            animate();


            function init() {

                container = document.createElement( 'div' );
                document.body.appendChild( container );

                var info = document.createElement( 'div' );
                info.style.position = 'absolute';
                info.style.top = '10px';
                info.style.width = '100%';
                info.style.textAlign = 'center';
                info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - interactive cubes';
                container.appendChild( info );

                scene = new THREE.Scene();

                camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
                scene.add( camera );

                crosshair = new THREE.Mesh(
                    new THREE.RingGeometry( 0.02, 0.04, 32 ),
                    new THREE.MeshBasicMaterial( {
                        color: 0xffffff,
                        opacity: 0.5,
                        transparent: true
                    } )
                );
                crosshair.position.z = - 2;
                camera.add( crosshair );

                room = new THREE.Mesh(
                    new THREE.BoxGeometry( 6, 6, 6, 8, 8, 8 ),
                    new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
                );
                scene.add( room );

                scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

                var light = new THREE.DirectionalLight( 0xffffff );
                light.position.set( 1, 1, 1 ).normalize();
                scene.add( light );

                var geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );

                for ( var i = 0; i < 200; i ++ ) {

                    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

                    object.position.x = Math.random() * 4 - 2;
                    object.position.y = Math.random() * 4 - 2;
                    object.position.z = Math.random() * 4 - 2;

                    object.rotation.x = Math.random() * 2 * Math.PI;
                    object.rotation.y = Math.random() * 2 * Math.PI;
                    object.rotation.z = Math.random() * 2 * Math.PI;

                    object.scale.x = Math.random() + 0.5;
                    object.scale.y = Math.random() + 0.5;
                    object.scale.z = Math.random() + 0.5;

                    object.userData.velocity = new THREE.Vector3();
                    object.userData.velocity.x = Math.random() * 0.01 - 0.005;
                    object.userData.velocity.y = Math.random() * 0.01 - 0.005;
                    object.userData.velocity.z = Math.random() * 0.01 - 0.005;

                    room.add( object );

                }

                raycaster = new THREE.Raycaster();

                renderer = new THREE.WebGLRenderer( { canvas: canvasEl, antialias: true } );
                renderer.setClearColor( 0x505050 );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.sortObjects = false;

                controls = new THREE.VRControls( camera );
                effect = new THREE.VREffect( renderer );

                if ( navigator.getVRDisplays ) {

                    navigator.getVRDisplays()
                        .then( function ( displays ) {
                            effect.setVRDisplay( displays[ 0 ] );
                            controls.setVRDisplay( displays[ 0 ] );
                        } )
                        .catch( function () {
                            // no displays
                        } );

                    document.body.appendChild( WEBVR.getButton( effect ) );

                }

                renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
                renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
                renderer.domElement.addEventListener( 'touchstart', onMouseDown, false );
                renderer.domElement.addEventListener( 'touchend', onMouseUp, false );

                //

                window.addEventListener( 'resize', onWindowResize, false );

            }

            function onMouseDown() {

                isMouseDown = true;

            }

            function onMouseUp() {

                isMouseDown = false;

            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                effect.setSize( window.innerWidth, window.innerHeight );

            }

            //

            function animate() {

                effect.requestAnimationFrame( animate );
                render();

            }

            function render() {

                var delta = clock.getDelta() * 60;

                if ( isMouseDown === true ) {

                    var cube = room.children[ 0 ];
                    room.remove( cube );

                    cube.position.set( 0, 0, - 0.75 );
                    cube.position.applyQuaternion( camera.quaternion );
                    cube.userData.velocity.x = ( Math.random() - 0.5 ) * 0.02 * delta;
                    cube.userData.velocity.y = ( Math.random() - 0.5 ) * 0.02 * delta;
                    cube.userData.velocity.z = ( Math.random() * 0.01 - 0.05 ) * delta;
                    cube.userData.velocity.applyQuaternion( camera.quaternion );
                    room.add( cube );

                }

                // find intersections

                raycaster.setFromCamera( { x: 0, y: 0 }, camera );

                var intersects = raycaster.intersectObjects( room.children );

                if ( intersects.length > 0 ) {

                    if ( INTERSECTED != intersects[ 0 ].object ) {

                        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                        INTERSECTED = intersects[ 0 ].object;
                        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                        INTERSECTED.material.emissive.setHex( 0xff0000 );

                    }

                } else {

                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

                    INTERSECTED = undefined;

                }

                // Keep cubes inside room

                for ( var i = 0; i < room.children.length; i ++ ) {

                    var cube = room.children[ i ];

                    cube.userData.velocity.multiplyScalar( 1 - ( 0.001 * delta ) );

                    cube.position.add( cube.userData.velocity );

                    if ( cube.position.x < - 3 || cube.position.x > 3 ) {

                        cube.position.x = THREE.Math.clamp( cube.position.x, - 3, 3 );
                        cube.userData.velocity.x = - cube.userData.velocity.x;

                    }

                    if ( cube.position.y < - 3 || cube.position.y > 3 ) {

                        cube.position.y = THREE.Math.clamp( cube.position.y, - 3, 3 );
                        cube.userData.velocity.y = - cube.userData.velocity.y;

                    }

                    if ( cube.position.z < - 3 || cube.position.z > 3 ) {

                        cube.position.z = THREE.Math.clamp( cube.position.z, - 3, 3 );
                        cube.userData.velocity.z = - cube.userData.velocity.z;

                    }

                    cube.rotation.x += cube.userData.velocity.x * 2 * delta;
                    cube.rotation.y += cube.userData.velocity.y * 2 * delta;
                    cube.rotation.z += cube.userData.velocity.z * 2 * delta;

                }

                controls.update();
                effect.render( scene, camera );

            }

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
                <button onClick={() => this.handleStart()} className="pt-button pt-intent-primary pt-large maring-15">START</button>

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
)(VRScene)