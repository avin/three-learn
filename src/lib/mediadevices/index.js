export default class MediaDevices {

    static startMedia = ({element, videoSource, audioSource}) => {

        if (!element){
            return new Error('Prop element is required');
        }

        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }

        const constraints = {
            audio: audioSource === false ? audioSource : {deviceId: audioSource ? {exact: audioSource} : undefined},
            video: videoSource === false ? videoSource : {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
        return navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => new Promise((resolve, reject) => {
                window.stream = stream; // make stream available to console
                element.srcObject = stream;

                navigator.mediaDevices.enumerateDevices();

                element.addEventListener('loadedmetadata', resolve, false);
            }))
            .catch(error => {
                console.log(error);
            })
    };

    static async getDevices() {

        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        let videoInputs = [];
        let audioInputs = [];
        let audioOutputs = [];

        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];

            let device = {
                id: deviceInfo.deviceId,
                label: deviceInfo.label || 'unknown'
            };

            if (deviceInfo.kind === 'audioinput') {
                audioInputs.push(device)
            } else if (deviceInfo.kind === 'audiooutput') {
                audioOutputs.push(device)
            } else if (deviceInfo.kind === 'videoinput') {
                videoInputs.push(device);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }

        return {
            videoInputs,
            audioInputs,
            audioOutputs,
        }
    };

}