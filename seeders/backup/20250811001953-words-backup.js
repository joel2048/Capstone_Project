'use strict';
const axios = require('axios');
const db = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let page = 1;
    let allWords = [];

    // while (true) {
      try {
        const response = await axios.get('https://jisho.org/api/v1/search/words?keyword=jlpt-n5&page=1', {
          headers: {
            'User-Agent': 'Mozilla/5.0' // or your app name/version
          }
        });


      // if (!json.data.length) break;
      
      allWords.push(...response.data.data);

      // if (json.data.length < 20) break;

      // page++;
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // polite timeout
    // }
          } catch (error) {
        console.error('Error:', error);
      }

    // wordJap
    let wordJapIdCount = 1  
    const mappedWordsJap = allWords.map(word => ({
      wordJapId: wordJapIdCount++,
      kanji: word.japanese[0]?.word || null,
      kana: word.japanese[0]?.reading || null,
      alt: JSON.stringify(word.japanese.slice(1).map(i => ({
          word: i.word || null,
          reading: i.reading || null
        }))),
      jlpt_level: "jlpt-n5",
      grammar_details: JSON.stringify([
        ...new Set(word.senses
          .flatMap(sense => sense.parts_of_speech)
          .filter(pos => pos !== 'Wikipedia definition' && pos !== 'Place')
        )
      ]),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    //wordDef
    let definitionMap = new Map();
    let definitionIdCounter = 1; //for handling duplicates
    let definitions = []; //for DB
    let wordLinks = [];

    allWords.forEach((word, id) => {
      const currentWordJapId = id + 1;

      word.senses[0].english_definitions.forEach(def => {
          // Create the definition entry if it’s new
          if (!definitionMap.has(def)) {
            definitionMap.set(def, definitionIdCounter++);
            definitions.push({
              wordDefId: definitionMap.get(def),
              definition: def,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }

          // Create the word-definition link (always)
          wordLinks.push({
            wordJapId: currentWordJapId,
            wordDefId: definitionMap.get(def),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      });


    // console.log(mappedWordsJap)
    await queryInterface.bulkInsert('wordjaps', mappedWordsJap);
    await queryInterface.bulkInsert('worddefs', definitions);
    await queryInterface.bulkInsert('wordlinks', wordLinks);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('wordjaps', null, {});
    await queryInterface.bulkDelete('worddefs', null, {});
    await queryInterface.bulkDelete('wordlinks', null, {});
  }
};