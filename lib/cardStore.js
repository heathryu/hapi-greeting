const fs = require('fs');

const CardStore = {
  cards: {},
  initialize: () => {
    CardStore.cards = loadCards();
  }
};

const loadCards = () => {
  const file = fs.readFileSync('./cards.json');
  return JSON.parse(file.toString());
};

module.exports = CardStore;
