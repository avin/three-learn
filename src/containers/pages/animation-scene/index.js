import React from 'react';
import { connect } from 'react-redux';


const THREE = window.THREE = require('three');

THREE.MorphAnimation = require('imports-loader?THREE=three!exports-loader?THREE.MorphAnimation!three/examples/js/MorphAnimation');


export class AnimationScene extends React.Component {

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
        let animation;
        let mesh;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasEl,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        //Add main mesh
        var loader = new THREE.ObjectLoader();
        loader.load(
            'assets/models/anim/sphere.json',
            ( newScene) => {

                scene = window.scene = newScene;

                camera = scene.getChildByName('Camera');
                //
                camera.setViewOffset(width, height, 0, 0, width, height);

                mesh = scene.getChildByName('Icosphere');

                animation = new THREE.MorphAnimation(mesh);
                animation.play();

                console.log(scene);
            }
        );


        let prevTime = Date.now();


        const render = () => {
            requestAnimationFrame(render);

            if (scene){
                renderer.render(scene, camera);
                mesh.rotation.z += 0.01

                if (animation){
                    let time = Date.now();
                    animation.update(time - prevTime);
                    prevTime = time;
                }
            }

        };

        render();
    }

    render() {
        const canvasStyle = {
            // paddingLeft: 0,
            // paddingRight: 0,
            // marginLeft: 'auto',
            // marginRight: 'auto',
            // display: 'block',
        };
        return (
            <div>
                <div>
                    <canvas ref="canvas" width={800} height={600} style={canvasStyle}/>
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
)(AnimationScene)