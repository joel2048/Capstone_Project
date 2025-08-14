'use strict';
const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const n3Count = await db.CollectionItems.count({
        where: { collectionId: 3 }
      });
      const n2Count = await db.CollectionItems.count({
        where: { collectionId: 2 }
      });
      const n1Count = await db.CollectionItems.count({
        where: { collectionId: 1 }
      });


      await queryInterface.bulkInsert('collections', [
        {
          collectionName: 'JLPT-N1',
          userId: null,
          cardTotal: n1Count,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          collectionName: 'JLPT-N2',
          userId: null,
          cardTotal: n2Count,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          collectionName: 'JLPT-N3',
          userId: n3Count,
          cardTotal: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    } catch (error) {
        console.error('Error:', error);
    }
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('collections', null, {});
  }
};
