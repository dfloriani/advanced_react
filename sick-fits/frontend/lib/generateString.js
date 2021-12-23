const Chance = require('chance');

const chance = new Chance();

export default function generateString(length = 6) {
  return chance.string({ length: 6 });
}
