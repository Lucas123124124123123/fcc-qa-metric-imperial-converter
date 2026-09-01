const VALID_UNITS = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];

const RETURN_UNIT = {
  gal: 'L',
  L: 'gal',
  mi: 'km',
  km: 'mi',
  lbs: 'kg',
  kg: 'lbs'
};

const SPELLED_OUT = {
  gal: 'gallons',
  L: 'liters',
  mi: 'miles',
  km: 'kilometers',
  lbs: 'pounds',
  kg: 'kilograms'
};

function ConvertHandler() {
  this.getNum = function (input) {
    const numberPart = String(input).match(/^[^a-zA-Z]*/)[0];

    if (numberPart === '') return 1;

    const parts = numberPart.split('/');
    if (parts.length > 2) return 'invalid number';

    const numbers = parts.map(Number);
    if (numbers.some(n => Number.isNaN(n))) return 'invalid number';
    if (parts.length === 2) {
      if (numbers[1] === 0) return 'invalid number';
      return numbers[0] / numbers[1];
    }
    return numbers[0];
  };

  this.getUnit = function (input) {
    const match = String(input).match(/[a-zA-Z]+$/);
    if (!match) return 'invalid unit';

    const unit = match[0].toLowerCase();
    if (!VALID_UNITS.includes(unit)) return 'invalid unit';

    return unit === 'l' ? 'L' : unit;
  };

  this.getReturnUnit = function (initUnit) {
    return RETURN_UNIT[initUnit] || 'invalid unit';
  };

  this.spellOutUnit = function (unit) {
    return SPELLED_OUT[unit] || 'invalid unit';
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      default:
        return 'invalid unit';
    }

    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return (
      initNum +
      ' ' +
      this.spellOutUnit(initUnit) +
      ' converts to ' +
      returnNum +
      ' ' +
      this.spellOutUnit(returnUnit)
    );
  };
}

module.exports = ConvertHandler;
