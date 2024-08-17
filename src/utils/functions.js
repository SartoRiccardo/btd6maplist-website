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
