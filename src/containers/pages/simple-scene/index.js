import React from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';

export class SimpleScene extends React.Component {
    componentDidMount() {
        const canvasEl = this.refs.canvas;
        const width = canvasEl.width;
        const height = canvasEl.height;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasEl
        });
        renderer.setSize(width, height);


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const render = function () {
            requestAnimationFrame(render);

            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;

            renderer.render(scene, camera);
        };

        render();
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" width={800} height={600}/>
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
)(SimpleScene)