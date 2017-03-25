import React from 'react';
import { connect } from 'react-redux';


export class Animation2Scene extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        const {position, rotation} = nextProps;

        return false;
    }

    componentDidMount() {
        // get the canvas DOM element
        var canvas = this.refs.canvas;

        // load the 3D engine
        var engine = new BABYLON.Engine(canvas, true);

        BABYLON.SceneLoader.Load('', 'assets/models/anim2/arm1.babylon', engine, function (newScene) {
            // Wait for textures and shaders to be ready
            newScene.executeWhenReady(function () {
                // Attach camera to canvas inputs
                newScene.activeCamera.attachControl(canvas);

                for(let mesh of newScene.meshes){
                    mesh.convertToFlatShadedMesh();
                    mesh.showBoundingBox = true;
                }

                let box = newScene.getMeshByName('Cube');

                newScene.beginAnimation(box, 60, 110, true, 1.0);

                console.log(newScene, box);


                console.log(newScene);

                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function() {
                    newScene.render();
                });
            });
        }, function (progress) {
            // To do: give progress feedback to user
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', function(){
            engine.resize();
        });
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