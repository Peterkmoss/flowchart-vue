export { default as ArrowLine } from './ArrowLine';
export { default as DashedLine } from './DashedLine';
export { default as Line } from './Line';

export const addVerticalLine = (points, center, second, penult) => {
  points.push({ x: center, y: second.y });
  points.push({ x: center, y: penult.y });
};

export const addVerticalLeftLine = (points, pos, second, penult) => {
  addVerticalLine(points, pos.x - 80, second, penult);
};

export const addVerticalRightLine = (points, pos, second, penult) => {
  addVerticalLine(points, pos.x + 80, second, penult);
};

export const addHorizontalLine = (points, center, second, penult) => {
  points.push({ x: second.x, y: center });
  points.push({ x: penult.x, y: center });
};

export const addHorizontalTopLine = (points, pos, second, penult) => {
  addHorizontalLine(points, pos.y - 50, second, penult);
};

export const addHorizontalBottomLine = (points, pos, second, penult) => {
  addHorizontalLine(points, pos.y + 50, second, penult);
};

export const addSecondXPenultY = (points, second, penult) => {
  points.push({ x: second.x, y: penult.y });
};

export const addPenultXSecondY = (points, second, penult) => {
  points.push({ x: penult.x, y: second.y });
};
