'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('users', [{
       auth0_id: 'test',
       userName: 'John Doe',
       email: 'test@test.com',
       createdAt: new Date(),
       updatedAt: new Date()
     }], {});

  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('users', null, {});
  }
};
