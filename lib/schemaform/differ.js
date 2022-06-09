function getKeysSorted(obj) {
  let keys = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) keys.push(k);
  }
  return keys.sort((a, b) => {
    return a > b ? 1 : a < b ? -1 : 0;
  });
}

function twoDee(m, n) {
  let c = [];
  for (let i = 0; i < m; i++) {
    c[i] = [];
    for (let j = 0; j < n; j++) c[i][j] = 0;
  }
  return c;
}

/** 深度对比两遍数据是否一致 */
function deepEqual(a, b) {
  if (getValType(a) !== getValType(b)) return false;
  if (getValType(a) === "object") {
    for (let k in a) {
      if (a.hasOwnProperty(k)) if (!deepEqual(a[k], b[k])) return false;
    }
    for (let k in b) {
      if (b.hasOwnProperty(k)) if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  if (getValType(a) === "array") {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  return a === b;
}

function makeLCSDeepArray(x, y) {
  let c = twoDee(x.length + 1, y.length + 1);
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      if (deepEqual(x[i], y[j])) {
        c[i + 1][j + 1] = c[i][j] + 1;
      } else {
        let m = Math.max(c[i + 1][j], c[i][j + 1]);
        c[i + 1][j + 1] = m;
      }
    }
  }
  return c;
}

function makeLCSArray(x, y) {
  let c = twoDee(x.length + 1, y.length + 1);
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      if (x[i] === y[j]) {
        c[i + 1][j + 1] = c[i][j] + 1;
      } else {
        let m = Math.max(c[i + 1][j], c[i][j + 1]);
        c[i + 1][j + 1] = m;
      }
    }
  }
  return c;
}

export const getValType = x => {
  if (x === null) return "null";
  if (x === undefined) return "undefined";
  let tof = typeof x;
  if (tof === "number" || tof === "string" || tof === "boolean")
    return "scalar";
  if (tof === "object") {
    if (x.constructor === Array) {
      return "array";
    } else {
      return "object";
    }
  }
  return "unknown";
};

export const arrayDiff = (a, b) => {
  let typeA = getValType(a);
  let typeB = getValType(b);
  let list = [];
  if (typeA !== "array" || typeB !== "array") {
    console.log("根类型需要为组件");
    return null;
  }
  let cc = makeLCSDeepArray(a, b);

  function diffInternal(c, x, y, i, j) {
    if (i > 0 && j > 0 && deepEqual(x[i - 1], y[j - 1])) {
      diffInternal(c, x, y, i - 1, j - 1);
      let va = x[i - 1];
      let o = {
        action: "common",
        type: getValType(va)
      };
      if (o.type === "object") o.diff = objectDiff(va, va);
      else if (o.type === "array") o.diff = arrayDiff(va, va);
      else o.value = va;
      list.push(o);
    } else {
      if (j > 0 && (i === 0 || c[i][j - 1] >= c[i - 1][j])) {
        diffInternal(c, x, y, i, j - 1);
        let vb = y[j - 1];
        let o = {
          action: "add",
          type: getValType(vb)
        };
        if (o.type === "object") o.diff = objectDiff({}, vb);
        else if (o.type === "array") o.diff = arrayDiff([], vb);
        else o.value = vb;
        list.push(o);
      } else if (i > 0 && (j === 0 || c[i][j - 1] < c[i - 1][j])) {
        diffInternal(c, x, y, i - 1, j);
        let va = x[i - 1];
        let o = {
          action: "remove",
          type: getValType(va)
        };
        if (o.type === "object") o.diff = objectDiff(va, {});
        else if (o.type === "array") o.diff = arrayDiff(va, []);
        else o.value = va;
        list.push(o);
      }
    }
  }
  diffInternal(cc, a, b, cc.length - 1, cc[0].length - 1);
  return list;
};

export const objectDiff = (a, b) => {
  let keysA, keysB;
  let typeA = getValType(a);
  let typeB = getValType(b);
  let list = [];

  if (typeA !== typeB) {
    console.log('对比的两个资源需要类型一致');
    return null;
  }

  if (typeA === "array") return arrayDiff(a, b);

  keysA = getKeysSorted(a);
  console.log('🚀 ~ file: differ.js ~ line 156 ~ objectDiff ~ keysA', keysA)
  keysB = getKeysSorted(b);
  let cc = makeLCSArray(keysA, keysB);

  function diffInternal(c, x, y, i, j) {
    if (i > 0 && j > 0 && x[i - 1] === y[j - 1]) {
      diffInternal(c, x, y, i - 1, j - 1);
      let key = x[i - 1];
      let va = a[key];
      let vb = b[key];
      let wva = getValType(va);
      let wvb = getValType(vb);
      if (wva === wvb && (wva === "object" || wva === "array")) {
        list.push({
          key: key,
          type: wva,
          action: "common",
          diff: objectDiff(va, vb)
        });
      } else if (va === vb) {
        list.push({
          action: "common",
          key: key,
          type: wva,
          value: va
        });
      } else {
        let orem = {
          action: "remove",
          key: key,
          type: wva,
          value: va
        };
        if (orem.type === "object") orem.diff = objectDiff(orem.value, {});
        else if (orem.type === "array") orem.diff = objectDiff(orem.value, []);
        list.push(orem);

        let oadd = {
          action: "add",
          key: key,
          type: wvb,
          value: vb
        };
        if (oadd.type === "object") oadd.diff = objectDiff({}, oadd.value);
        else if (oadd.type === "array") oadd.diff = objectDiff([], oadd.value);
        list.push(oadd);
      }
    } else {
      if (j > 0 && (i === 0 || c[i][j - 1] >= c[i - 1][j])) {
        diffInternal(c, x, y, i, j - 1);
        let key = y[j - 1];
        let o = {
          action: "add",
          key: key,
          type: getValType(b[key])
        };
        if (o.type === "object") o.diff = objectDiff({}, b[key]);
        else if (o.type === "array") o.diff = objectDiff([], b[key]);
        else o.value = b[key];
        list.push(o);
      } else if (i > 0 && (j === 0 || c[i][j - 1] < c[i - 1][j])) {
        diffInternal(c, x, y, i - 1, j);
        let key = x[i - 1];
        let o = {
          action: "remove",
          key: key,
          type: getValType(a[key])
        };
        if (o.type === "object") o.diff = objectDiff(a[key], {});
        else if (o.type === "array") o.diff = objectDiff(a[key], []);
        else o.value = a[key];
        list.push(o);
      }
    }
  }
  diffInternal(cc, keysA, keysB, cc.length - 1, cc[0].length - 1);
  return list;
};
