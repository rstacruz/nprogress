let pending = [];

/**
 * (Internal) Queues up an action. Doesn't execute actions unless others have
 * finished.
 *
 * @param {(() => any) => void} fn
 */

export function queue(fn) {
  pending.push(fn);
  if (pending.length == 1) next();
}

function next() {
  var fn = pending.shift();
  if (fn) {
    fn(next);
  }
}
