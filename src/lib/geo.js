export function getRectPolygonByCorners(corners) {
    return [
        [corners[0][0], corners[0][1]],
        [corners[0][0], corners[1][1]],
        [corners[1][0], corners[1][1]],
        [corners[1][0], corners[0][1]],
        [corners[0][0], corners[0][1]]
    ]
}

export function getMultipolygon(points) {
    let multipolygon = isCoords(points[0]) ? [points] : points
    multipolygon = isCoords(multipolygon[0][0]) ? [multipolygon] : multipolygon
    return multipolygon
}

export function reversePolygonCoords(points) {
    return [].concat(points).map(point => {
        if (typeof point[0] === 'number') return [].concat(point).reverse()
        return reversePolygonCoords(point)
    })
}

export function isCoords(arr) {
    return arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number'
}