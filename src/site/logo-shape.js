// Native Bezier reconstruction of the supplied combined HD silhouette.
// Replaces JPEG trace teeth and the false hairline hole with clean tool paths.
// Reference proportions, stems and flowing crossbar are preserved.
const scale = 5.2 / 765;
const centerX = 406.5, centerY = 261;
export function createReferenceShapes(THREE) {
  const shape = new THREE.Shape();
  const point = (x, y) => [(x - centerX) * scale, (centerY - y) * scale];
  const move = (x, y) => shape.moveTo(...point(x, y));
  const line = (x, y) => shape.lineTo(...point(x, y));
  const curve = (a, b, c, d, e, f) => shape.bezierCurveTo(...point(a, b), ...point(c, d), ...point(e, f));
  // H left stem, machined serif ends and continuous shoulders.
  move(25, 18); line(25, 21);
  curve(65, 25, 83, 42, 83, 75); line(83, 447);
  curve(83, 478, 65, 494, 28, 498);
  line(28, 503); line(206, 503); line(206, 498);
  curve(171, 494, 153, 479, 153, 447);
  line(153, 266); line(270, 266);
  curve(316, 266, 353, 277, 387, 306);
  // H right stem merges into the D foot.
  line(387, 443); curve(387, 478, 375, 494, 338, 498);
  line(338, 503); line(618, 503);
  // D outer bowl: continuous cubic arcs instead of short traced segments.
  curve(714, 503, 789, 410, 789, 274);
  curve(789, 131, 704, 19, 553, 19);
  line(338, 19); line(338, 22);
  curve(373, 26, 387, 43, 387, 75);
  line(387, 268); curve(412, 285, 436, 305, 458, 327);
  // Inner D bowl.
  line(458, 50); curve(458, 34, 471, 30, 486, 30);
  line(541, 30); curve(653, 30, 718, 132, 718, 270);
  curve(718, 408, 665, 495, 583, 495); line(514, 495);
  curve(474, 495, 459, 479, 459, 449); line(459, 386);
  // Original crossbar and swash.
  curve(491, 423, 513, 460, 548, 475);
  curve(570, 484, 592, 486, 610, 485.5);
  curve(615, 485.2, 615, 481.8, 610, 481.5);
  curve(577, 480, 556, 461, 525, 427);
  curve(502, 401, 479, 364, 454, 334);
  curve(409, 283, 369, 255, 302, 255);
  line(153, 255); line(153, 71);
  curve(153, 41, 172, 25, 206, 21);
  line(206, 18); line(25, 18); shape.closePath();
  return [shape];
}
export const referenceLogoBounds = Object.freeze({width:5.2,height:485*scale,sourceWidth:765,sourceHeight:485});
