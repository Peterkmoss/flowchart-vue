import * as d3 from 'd3';
import {approximatelyEquals} from './math';
import {
  addVerticalLine,
  addHorizontalLine,
  addPenultXSecondY,
  addSecondXPenultY,
  addVerticalLeftLine,
  addHorizontalTopLine,
  addVerticalRightLine,
  addHorizontalBottomLine,
} from './Line'

export const OFFSET = 20;

export function lineTo(g, from, to, lineWidth, strokeStyle, dash) {
  const lineGenerator = d3.line().x(d => d.x).y(d => d.y);
  const path = g.append('path').
      attr('stroke', strokeStyle).
      attr('stroke-width', lineWidth).
      attr('fill', 'none').
      attr('d', lineGenerator([from, to]));
  if (dash) {
    path.style('stroke-dasharray', dash.join(','));
  }
  return path;
}

function connect(g, from, to) {
  if (!to.position) {
    to.position = from.x > to.x ? 'right' : 'left';
  }
  
  const points = [];

  const centerX = from.x + (to.x - from.x) / 2;
  const centerY = from.y + (to.y - from.y) / 2;

  const second = from;
  const penult = to;

  points.push(from);
  points.push(second);

  switch (getDirection(from, to)) {
    case 'lu': {
      if (from.position === 'bottom') {
        switch (to.position) {
          case 'top':
            addVerticalLine(points, centerX, second, penult);
            break;
          default: {
            addPenultXSecondY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'top':
          case 'right':
            addSecondXPenultY(points, second, penult);
            break;
          default: {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
        }
      } else {
        // from.position is left
        switch (to.position) {
          case 'top':
          case 'right':
            addVerticalLine(points, centerX, second, penult);
            break;
          default: {
            addPenultXSecondY(points, second, penult);
            break;
          }
        }
      }
      break;
    }
    case 'u':
      if (from.position === 'right') {
        switch (to.position) {
          case 'right': {
            break;
          }
          case 'top': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          default: {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'left':
          case 'right':
            addPenultXSecondY(points, second, penult);
            break;
          default: {
            addVerticalRightLine(points, from, second, penult);
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'left': {
            addPenultXSecondY(points, second, penult);
            break;
          }
          case 'right': {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
          case 'top':
            addVerticalRightLine(points, from, second, penult);
            break;
          default: {
            break;
          }
        }
      } else {
        // left
        switch (to.position) {
          case 'left':
          case 'right':
            break;
          default: {
            points.push({ x: second.x, y: penult.y });
            break;
          }
        }
      }
      break;
    case 'ru':
      if (from.position === 'right') {
        switch (to.position) {
          case 'left': {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
          case 'top': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          default: {
            addPenultXSecondY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'top': {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
          default: {
            addPenultXSecondY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'right': {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
          default: {
            addSecondXPenultY(points, second, penult);
            break;
          }
        }
      } else {
        // left
        switch (to.position) {
          case 'left':
          case 'top':
            addSecondXPenultY(points, second, penult);
            break;
          default: {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
        }
      }
      break;
    case 'l':
      if (from.position === 'right') {
        switch (to.position) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine(points, from, second, penult);
            break;
          default: {
            addHorizontalBottomLine(points, from, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'left': {
            addHorizontalBottomLine(points, from, second, penult);
            break;
          }
          case 'right': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          case 'top': {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
          default: {
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'left': {
            addHorizontalTopLine(points, from, second, penult);
            break;
          }
          case 'right': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          case 'top': {
            break;
          }
          default: {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
        }
      } else {
        // left
        switch (to.position) {
          case 'left': {
            addHorizontalTopLine(points, from, second, penult);
            break;
          }
          case 'right': {
            break;
          }
          default: {
            addSecondXPenultY(points, second, penult);
            break;
          }
        }
      }
      break;
    case 'r':
      if (from.position === 'right') {
        switch (to.position) {
          case 'left': {
            break;
          }
          case 'right': {
            addHorizontalTopLine(points, from, second, penult);
            break;
          }
          default: {
            addSecondXPenultY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'left': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          case 'right': {
            addHorizontalBottomLine(points, from, second, penult);
            break;
          }
          case 'top': {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
          default: {
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'left': {
            addPenultXSecondY(points, second, penult);
            break;
          }
          case 'right': {
            addHorizontalTopLine(points, second, penult);
            break;
          }
          case 'top': {
            break;
          }
          default: {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
        }
      } else {
        // left
        switch (to.position) {
          case 'left':
          case 'right':
          case 'top':
            addHorizontalTopLine(points, from, second, penult);
            break;
          default: {
            addHorizontalBottomLine(points, from, second, penult);
            break;
          }
        }
      }
      break;
    case 'ld':
      if (from.position === 'right') {
        switch (to.position) {
          case 'left': {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
          default: {
            addSecondXPenultY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'left': {
            addPenultXSecondY(points, second, penult);
            break;
          }
          case 'top': {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
          default: {
            addSecondXPenultY(points, second, penult);
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'left':
          case 'right':
          case 'top':
            addPenultXSecondY(points, second, penult);
            break;
          default: {
            addVerticalLine(points, centerX, second, penult);
            break;
          }
        }
      }
      break;
    case 'd':
      if (from.position === 'right') {
        switch (to.position) {
          case 'left': {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
          case 'right': {
            addPenultXSecondY(points, second, penult);
            break;
          }
          case 'top': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          default: {
            addVerticalRightLine(points, from, second, penult);
            break;
          }
        }
      } else if (from.position === 'bottom') {
        switch (to.position) {
          case 'left':
          case 'right':
            addPenultXSecondY(points, second, penult);
            break;
          case 'top': {
            break;
          }
          default: {
            addVerticalRightLine(points, from, second, penult);
            break;
          }
        }
      } else if (from.position === 'top') {
        switch (to.position) {
          case 'left': {
            addVerticalLeftLine(points, from, second, penult);
            break;
          }
          default: {
            addVerticalRightLine(points, from, second, penult);
            break;
          }
        }
      } else {
        // left
        switch (to.position) {
          case 'left': {
            break;
          }
          case 'right': {
            addHorizontalLine(points, centerY, second, penult);
            break;
          }
          case 'top': {
            addSecondXPenultY(points, second, penult);
            break;
          }
          default: {
            addVerticalLeftLine(points, from, second, penult);
            break;
          }
        }
      }
      break;
    case 'rd': {
      if (from.position === 'right' && to.position === 'left') {
        addVerticalLine(points, centerX, second, penult);
      } else if (from.position === 'right' && to.position === 'bottom') {
        addSecondXPenultY(points, second, penult);
      } else if (
          (from.position === 'right' && to.position === 'top') ||
          (from.position === 'right' && to.position === 'right')
      ) {
        addPenultXSecondY(points, second, penult);
      } else if (from.position === 'bottom' && to.position === 'left') {
        addSecondXPenultY(points, second, penult);
      } else if (from.position === 'bottom' && to.position === 'right') {
        addPenultXSecondY(points, second, penult);
      } else if (from.position === 'bottom' && to.position === 'top') {
        addHorizontalLine(points, centerY, second, penult);
      } else if (from.position === 'bottom' && to.position === 'bottom') {
        addSecondXPenultY(points, second, penult);
      } else if (from.position === 'top' && to.position === 'left') {
        addPenultXSecondY(points, second, penult);
      } else if (from.position === 'top' && to.position === 'right') {
        addPenultXSecondY(points, second, penult);
      } else if (from.position === 'top' && to.position === 'top') {
        addPenultXSecondY(points, second, penult);
      } else if (from.position === 'top' && to.position === 'bottom') {
        addVerticalLine(points, centerX, second, penult);
      } else if (from.position === 'left' && to.position === 'left') {
        addSecondXPenultY(points, second, penult);
      } else if (from.position === 'left' && to.position === 'right') {
        addHorizontalLine(points, centerY, second, penult);
      } else if (from.position === 'left' && to.position === 'top') {
        addHorizontalLine(points, centerY, second, penult);
      } else if (from.position === 'left' && to.position === 'bottom') {
        addSecondXPenultY(points, second, penult);
      }
      break;
    }
  }
  points.push(penult);
  points.push(to);

}

export function arrowTo(g, from, to, lineWidth, strokeStyle) {
  let path = lineTo(g, from, to, lineWidth, strokeStyle);
  const id = 'arrow' + strokeStyle.replace('#', '');
  g.append('marker').
      attr('id', id).
      attr('markerUnits', 'strokeWidth').
      attr('viewBox', '0 0 12 12').
      attr('refX', 9).
      attr('refY', 6).
      attr('markerWidth', 12).
      attr('markerHeight', 12).
      attr('orient', 'auto').
      append('path').
      attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2').
      attr('fill', strokeStyle);
  path.attr('marker-end', 'url(#' + id + ')');
  return path;
}

export const getDirection = (from, to) => {
  // Use approximatelyEquals to fix the problem of css position presicion
  if (to.x < from.x && approximatelyEquals(to.y, from.y)) {
    return 'l';
  }
  if (to.x > from.x && approximatelyEquals(to.y, from.y)) {
    return 'r';
  }
  if (approximatelyEquals(to.x, from.x) && to.y < from.y) {
    return 'u';
  }
  if (approximatelyEquals(to.x, from.x) && to.y > from.y) {
    return 'd';
  }
  if (to.x < from.x && to.y < from.y) {
    return 'lu';
  }
  if (to.x > from.x && to.y < from.y) {
    return 'ru';
  }
  if (to.x < from.x && to.y > from.y) {
    return 'ld';
  }
  return 'rd';
}

export {
  connect,
};
