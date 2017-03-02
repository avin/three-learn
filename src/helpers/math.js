import _ from 'lodash';

export function averageArrToArr(srcArr, dstArr, ratio=1) {
    _.each(srcArr, (arrItem, index) => {
        srcArr[index] = (arrItem + dstArr[index])/(2*ratio);
    });
}