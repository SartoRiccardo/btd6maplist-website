// https://stackoverflow.com/a/2901298
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getPositionColor(position) {
  if (position === 1) return "#ffd54f";
  else if (position === 2) return "#e0e0e0";
  else if (position === 3) return "#cd7f32";
  return null;
}

export function listEquals(l1, l2) {
  if (l1.length !== l2.length) return false;
  for (let i = 0; i < l1.length; i++) if (l1[i] !== l2[i]) return false;
  return true;
}

export function isInt(str) {
  return /^[0-9]+$/.test(str);
}

export function isFloat(str) {
  return /^[0-9]+(?:\.[0-9]+)?$/.test(str);
}

// https://stackoverflow.com/a/8831937
/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const removeFieldCode = (array) =>
  array.map((obj) => {
    const ret = { ...obj };
    delete ret.count;
    return ret;
  });

export const groupCompsByUser = (completions) => {
  let runsBySameUsr = {};
  let keyOrder = [];
  for (const run of completions) {
    const key = hashCode(
      run.user_ids.reduce((agg, uid) => agg + uid, "")
    ).toString();
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
      runsBySameUsr[key] = [];
    }
    runsBySameUsr[key].push(run);
  }
  return { runsBySameUsr, keyOrder };
};

export const groupCompsByMap = (completions) => {
  const runsOnSameMap = {};
  const keyOrder = [];
  for (const run of completions) {
    const key = run.map?.code || run.map;
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
      runsOnSameMap[key] = [];
    }
    runsOnSameMap[key].push(run);
  }
  return { keyOrder, runsOnSameMap };
};
