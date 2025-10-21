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
      run.users.reduce((agg, user) => agg + (user?.id || user), "")
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

export const groupConsecutiveCompsByMap = (completions) => {
  if (completions.length === 0) {
    return [];
  }

  const groups = [];
  let currentGroup = [completions[0]];

  for (let i = 1; i < completions.length; i++) {
    if ((completions[i].map?.code || completions[i].map) === (currentGroup[0].map?.code || currentGroup[0].map)) {
      currentGroup.push(completions[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [completions[i]];
    }
  }
  groups.push(currentGroup);

  return groups;
};

export const deepChange = (obj, path, value) => {
  const lastPathMatch = /(?:\.?([^\.\[\s]+)|\[(\d+)\])$/g.exec(path);
  const lastPath = lastPathMatch[1] || lastPathMatch[2];
  const paths = path
    .substring(0, path.length - lastPathMatch[0].length)
    .split(".")
    .filter((p) => p.length);
  let cur = obj;
  for (let i = 0; i < paths.length; i++) {
    const objPath = paths[i].split("[")[0];
    cur = cur[objPath];
    const arrayIdxs = (paths[i].match(/\[(\d+)\]/g) || []).map((match) =>
      parseInt(match.slice(1, -1))
    );
    for (const idx of arrayIdxs) {
      cur = cur[idx];
    }
  }
  cur[lastPath] = value;
  return obj;
};

export const intToHex = (color) => `#${color.toString(16).padStart(6, "0")}`;
export const hexToInt = (hex) => parseInt(hex.slice(1), 16);
