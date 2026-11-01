import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorizeHtml, vectorizeCss} from '../src/site/vector-icons.js';
test('UI arrows become vectors while attributes and executable content stay intact', () => {
  const result = vectorizeHtml('<a aria-label="Yukarı ↑">Git ↗️</a><script>const arrow="↑";</script>');
  assert.match(result, /class="hd-icon"/);
  assert.match(result, /aria-label="Yukarı ↑"/);
  assert.match(result, /const arrow="↑"/);
  assert.doesNotMatch(result, /Git ↗/);
  assert.equal(vectorizeHtml(result), result);
});
test('CSS arrows use vector masks rather than emoji glyphs', () => {
  const result = vectorizeCss('.cta::after{content:"↗";color:lime}');
  assert.match(result, /-webkit-mask:url/);
  assert.doesNotMatch(result, /↗/);
});
