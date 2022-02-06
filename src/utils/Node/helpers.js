export const borderColor = (isSelected) => isSelected ? '#666666' : '#bbbbbb';

const halfWidth = (node) => node.width / 2;
const halfHeight = (node) => node.height / 2;
export const positionMap = (node) => ({
  top: { x: node.x + halfWidth(node), y: node.y },
  left: { x: node.x, y: node.y + halfHeight(node) },
  bottom: { x: node.x + halfWidth(node), y: node.y + node.height },
  right: { x: node.x + node.width, y: node.y + halfHeight(node) },
});

export const createBoundaryBox = (node) => [
  { x: node.x, y: node.y },
  { x: node.x + node.width, y: node.y + node.height },
];
