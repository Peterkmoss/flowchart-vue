import * as d3 from 'd3';

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

export function arrowTo(g, from, to, lineWidth, strokeStyle) {
  const path = lineTo(g, from, to, lineWidth, strokeStyle);
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
