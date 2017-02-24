import React from 'react';
import { connect } from 'react-redux';
import Control from './Control';
import TWEEN from 'tween.js';

const THREE = require('three');
THREE.CopyShader = require('imports-loader?THREE=three!exports-loader?THREE.CopyShader!three/examples/js/shaders/CopyShader');
THREE.EffectComposer = require('imports-loader?THREE=three!exports-loader?THREE.EffectComposer!three/examples/js/postprocessing/EffectComposer');
THREE.RenderPass = require('imports-loader?THREE=three!exports-loader?THREE.RenderPass!three/examples/js/postprocessing/RenderPass');
THREE.ShaderPass = require('imports-loader?THREE=three!exports-loader?THREE.ShaderPass!three/examples/js/postprocessing/ShaderPass');
THREE.HorizontalBlurShader = require('imports-loader?THREE=three!exports-loader?THREE.HorizontalBlurShader!three/examples/js/shaders/HorizontalBlurShader');
THREE.VerticalBlurShader = require('imports-loader?THREE=three!exports-loader?THREE.VerticalBlurShader!three/examples/js/shaders/VerticalBlurShader');


export class SimpleScene extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        const {position, rotation} = nextProps;
        if (this.props.position !== position) {
            new TWEEN.Tween(this.cube.position).to(position.toJS(), 200)
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
        }
        if (this.props.rotation !== rotation) {
            new TWEEN.Tween(this.cube.rotation).to(rotation.toJS(), 1000)
                .easing(TWEEN.Easing.Elastic.Out)
                .start();
        }

        return false;
    }

    componentDidMount() {
        const canvasEl = this.refs.canvas;
        const rect = canvasEl.getBoundingClientRect();

        canvasEl.width = window.innerWidth - rect.left * 2;
        canvasEl.height = window.innerHeight - rect.top - 4;

        const width = canvasEl.width;
        const height = canvasEl.height;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasEl
        });
        renderer.setSize(width, height);

        //Setup visual effect

        const composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));

        const hblur = this.hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
        composer.addPass(hblur);

        const vblur = this.vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
        vblur.renderToScreen = true;
        composer.addPass(vblur);

        //Add main mesh

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = this.cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const render = () => {
            requestAnimationFrame(render);

            //Change blur on Z position changes
            hblur.uniforms.h.value = cube.position.z * 0.0005;
            vblur.uniforms.v.value = cube.position.z * 0.0005;

            TWEEN.update();

            //renderer.render(scene, camera);
            composer.render();
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
                <Control />
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
)(SimpleScene)