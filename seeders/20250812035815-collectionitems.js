'use strict';
const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const N3Words = await db.Word.findAll({
      where: { jlpt_level: 'jlpt-n3' }
    });

    const N3Collection = N3Words.map(word => ({
      slug: word.slug,
      collectionId: parseInt(3),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const N2Words = await db.Word.findAll({
      where: { jlpt_level: 'jlpt-n2' }
    });

    const N2Collection = N2Words.map(word => ({
      slug: word.slug,
      collectionId: parseInt(2),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const N1Words = await db.Word.findAll({
      where: { jlpt_level: 'jlpt-n1' }
    });

    const N1Collection = N1Words.map(word => ({
      slug: word.slug,
      collectionId: parseInt(1),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

 
    await queryInterface.bulkInsert('collectionitems', N3Collection);
    await queryInterface.bulkInsert('collectionitems', N2Collection);
    await queryInterface.bulkInsert('collectionitems', N1Collection);
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('collectionitems', null, {});
  }
};
