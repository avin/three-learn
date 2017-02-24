import React from 'react';
import { connect } from 'react-redux';
import * as THREE from 'three';
import Counter from '../counter'

export class SimpleScene extends React.Component {

    //newCubePosition = 0;

    shouldComponentUpdate(nextProps, nextState){
        //this.newCubePosition = nextProps.value;

        return false;
    }

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
        const cube = this.cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const render = () => {
            requestAnimationFrame(render);

            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;

            if (cube.position.y <= this.props.value){
                cube.position.y = cube.position.y + 0.1
            }

            if (cube.position.y >= this.props.value){
                cube.position.y = cube.position.y - 0.1
            }

            renderer.render(scene, camera);
        };

        render();
    }

    component

    render() {
        return (
            <div>
                <Counter />
                <canvas ref="canvas" width={800} height={600}/>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const value = state.counter.get('value');
    return {
        value
    }
}

export default connect(
    mapStateToProps,
    {}
)(SimpleScene)