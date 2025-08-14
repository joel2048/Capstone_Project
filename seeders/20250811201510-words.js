'use strict';
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const db = require('../models');

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

function getLowestJlptLevel(jlptArray) {
  const levels = jlptArray
    .map(level => parseInt(level.replace('jlpt-n', ''), 10))

  if (levels.length === 0) return null;

  const lowestLevel = Math.max(...levels);

  return String(`jlpt-n${lowestLevel}`);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let page = 1;
    let allWords = [];
    let seen = new Set();
    let jlpt = 3; //set jlpt level to start from (5 is highest (easiest level))

    while (true) {
      try {
        const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=jlpt-n${jlpt}&page=${page}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          },
          timeout: 4000 // polite timeout
        });

      if (jlpt < 1) break;
      if (!response.data.data.length && jlpt == 1) break;
      if (!response.data.data.length && jlpt > 1) {
        jlpt = jlpt - 1
        page = 1
        continue
      };
      
      const commonWords = response.data.data.filter(word => word.is_common)


      commonWords.forEach(word => {
        if (!seen.has(word.slug)) {
          seen.add(word.slug);
          allWords.push(word);
        }
      });


      if (response.data.data.length < 20 && jlpt == 1) break;
      if (response.data.data.length < 20 && jlpt > 1) {
        jlpt = jlpt - 1
        page = 1
        continue
      };

      page++;

    } catch (error) {
        console.error('Error:', error);
    }};

    // words
    const mappedWords = allWords.map(word => ({
      slug: word.slug,
      kanji: word.japanese[0]?.word || null,
      kana: word.japanese[0]?.reading || null,
      jlpt_level: getLowestJlptLevel(word.jlpt),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // console.log(mappedWords)
    try {
      await db.Word.bulkCreate(mappedWords, {
        updateOnDuplicate: ['kanji', 'kana', 'jlpt_level', 'updatedAt']
      });
    } catch (error) {
        console.error('Error:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('words', null, {});
  }
};