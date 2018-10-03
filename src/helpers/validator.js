const definitions = {
  numNodes: /^([1-9]|1[0-5])$/,
  lowerBound: /^[0-9]$|^[1-9][0-9]$|^[1-9][0-9][0-9]$/,
  upperBound: /^[0-9]$|^[1-9][0-9]$|^[1-9][0-9][0-9]$/
};

export function validate(key, val) {
  return definitions[key].test(val);
}
