export function distanceOfPointToLine(beginX, beginY, endX, endY, ptX, ptY) {
  const k = (endY - beginY || 1) / (endX - beginX || 1);
  const b = beginY - k * beginX;
  return Math.abs(k * ptX - ptY + b) / Math.sqrt(k * k + 1);
}

export function between(num1, num2, num) {
  return (num > num1 && num < num2) || (num > num2 && num < num1);
}

export function approximatelyEquals(n, m) {
  return Math.abs(m - n) <= 3;
}

/**
  * @param { { x: number, y: number }[] } points
  */
export function getEdgeOfPoints(points) {
  const minX = points.reduce((prev, point) => {
    return point.x < prev ? point.x : prev;
  }, Infinity);
  const maxX = points.reduce((prev, point) => {
    return point.x > prev ? point.x : prev;
  }, 0);
  const minY = points.reduce((prev, point) => {
    return point.y < prev ? point.y : prev;
  }, Infinity);
  const maxY = points.reduce((prev, point) => {
    return point.y > prev ? point.y : prev;
  }, 0);
  return {start: {x: minX, y: minY}, end: {x: maxX, y: maxY}};
}

export function pointRectangleIntersection(p, r) {
  return p.x > r.start.x && p.x < r.end.x && p.y > r.start.y && p.y < r.end.y;
}

export function roundTo20(number) {
  return number < 20 ? 20 : number;
}
