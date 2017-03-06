import _ from 'lodash';

export function averageArrToArr(srcArr, dstArr, ratio=2) {
    _.each(srcArr, (arrItem, index) => {
        srcArr[index] = (arrItem + dstArr[index])/(ratio);
    });
}