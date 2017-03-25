import React from 'react';
import { connect } from 'react-redux';


const THREE = window.THREE = require('three');

THREE.MorphAnimation = require('imports-loader?THREE=three!exports-loader?THREE.MorphAnimation!three/examples/js/MorphAnimation');


export class Animation2Scene extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        const {position, rotation} = nextProps;

        return false;
    }

    componentDidMount() {
        const canvasEl = this.refs.canvas;
        const rect = canvasEl.getBoundingClientRect();

        canvasEl.width = window.innerWidth - rect.left * 2;
        canvasEl.height = window.innerHeight - rect.top - 4;

        const width = canvasEl.width;
        const height = canvasEl.height;

        let scene;
        let camera;
        let morphAnimation;
        let mesh;
        let sceneAnimationClip;
        let mixer;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        //Add main mesh
        var loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/anim2/ani.json',
            (newScene) => {

                scene = window.scene = newScene;
                console.log(scene);


                camera = scene.getObjectByName('Camera');
                camera.setViewOffset(width, height, 0, 0, width, height);

                mesh = scene.getChildByName('Cube');


                mesh.material.skinning = true;
                mixer = new THREE.AnimationMixer(mesh);

                for ( var i = 0; i < mesh.geometry.animations.length; ++ i ) {
                    mixer.clipAction( mesh.geometry.animations[ i ] );
                }

                mixer.clipAction('Foo.001').setEffectiveWeight(1).play();

            }
        );


        var clock = new THREE.Clock();

        const render = () => {
            requestAnimationFrame(render);

            var delta = clock.getDelta();

            if (scene) {
                renderer.render(scene, camera);

                if (mesh){
                    mesh.rotation.z += 0.01
                }

                if (mixer) {
                    mixer.update(delta);
                }
            }

        };

        render();
    }

    render() {
        return (
            <div>
                <div>
                    <canvas ref="canvas" width={800} height={600}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        position: state.simpleScene.get('position'),
        rotation: state.simpleScene.get('rotation'),
    }
}

export default connect(
    mapStateToProps,
    {}
)(Animation2Scene)