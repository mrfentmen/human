// Precision — Numerical exactness verification for AI agents

class Precision {
  constructor(options = {}) {
    this.tolerance = options.tolerance || 0.0001;
  }

  checkMath(expression, expected) {
    try {
      // Safe eval of math expression
      const result = this.safeEval(expression);
      const diff = Math.abs(result - expected);
      return {
        passed: diff <= this.tolerance,
        result,
        expected,
        diff,
        message: diff <= this.tolerance ? 'Correct' : `Expected ${expected}, got ${result}`
      };
    } catch (e) {
      return { passed: false, result: null, expected, diff: Infinity, message: `Error: ${e.message}` };
    }
  }

  safeEval(expr) {
    // Only allow numbers, operators, parentheses, and math functions
    const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
    return Function('"use strict"; return (' + sanitized + ')')();
  }

  checkUnits(value, unit, expectedUnit) {
    const conversions = {
      'm': { 'cm': 100, 'mm': 1000, 'km': 0.001 },
      'kg': { 'g': 1000, 'mg': 1000000 },
      'l': { 'ml': 1000 },
      's': { 'ms': 1000, 'min': 1/60, 'h': 1/3600 }
    };

    if (unit === expectedUnit) return { passed: true, message: 'Units match' };
    if (conversions[unit] && conversions[unit][expectedUnit]) {
      const converted = value * conversions[unit][expectedUnit];
      return { passed: true, converted, message: `Converted to ${converted} ${expectedUnit}` };
    }
    return { passed: false, message: `Cannot convert ${unit} to ${expectedUnit}` };
  }

  round(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  checkSignificantFigures(value, sigFigs) {
    const str = value.toString();
    const digits = str.replace(/[^0-9]/g, '');
    const leadingZeros = digits.match(/^0+/);
    const significant = leadingZeros ? digits.slice(leadingZeros[0].length) : digits;
    return significant.length >= sigFigs;
  }
}

module.exports = Precision;
module.exports.Precision = Precision;
module.exports.default = Precision;
