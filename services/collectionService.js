const { Collection, CollectionItems, Word } = require("../models");
const db = require("../models");

module.exports = {
  async getAllCollections(req, res) {
    try {
      const { count, rows: collections } = await Collection.findAndCountAll({
        attributes: ["collectionName", "userId", "cardTotal"],
      });

      const response = {
        total: count,
        collections,
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({
        error: "Failed to retrieve collections",
        details: err.message,
      });
    }
  },

  async newCollection(req, res) {
    const { userId, wordList, name } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const newCollection = await Collection.create(
        {
          collectionName: name,
          userId: userId,
          cardTotal: wordList.length
        },
        { transaction: t }
      );

      await Promise.all(
        wordList.map((word) =>
          CollectionItems.create(
            {
              slug: word.slug,
              collectionId: newCollection.collectionId
            },
            { transaction: t }
          )
        )
      );

      await t.commit();
      res.json({ success: true, collectionId });
    } catch (err) {
      if (!t.finished) {
        await t.rollback();
      }
      res.status(500).json({
        error: "Failed to create new collection",
        details: err.message,
      });
    }
  },

  async editCollection(req, res) {
    const { collectionId, newWordList, newName } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const updatedCollection = await Collection.update(
        {
          collectionName: newName,
          cardTotal: newWordList.length
        },
        { where: { collectionId: collectionId }, transaction: t }
      );

    await CollectionItems.destroy({
      where: { collectionId },
      transaction: t
    });

    await CollectionItems.bulkCreate(
      newWordList.map(word => ({
        slug: word.slug,
        collectionId
      })),
      { transaction: t }
    );

    await t.commit();
    res.json({ success: true, collectionId });
    } catch (err) {
      if (!t.finished) {
        await t.rollback();
      }
      res.status(500).json({
        error: "Failed to update collection",
        details: err.message,
      });
    }
  },

  async deleteCollection(req, res) {
    const {collectionId} = req.body;
    try {
      await Collection.destroy({
          where: {
              collectionId: collectionId
          }
      });

      await CollectionItems.destroy({
        where: {
          collectionId: collectionId
        }
      })

      res.json({ success: true, collectionId });
    } catch (err) {
      res.status(500).json({
        error: "Failed to delete collection",
        details: err.message,
      });
    }
  },

  async getCollectionItems(req, res) {
    const collectionId  = parseInt(req.params.id, 10)
    try {
      const { count, rows: collectionitems } = await CollectionItems.findAndCountAll({
        where: {collectionId: collectionId},
        attributes: ["slug"]
      });

      const response = {
        total: count,
        collectionitems
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({
        error: "Failed to retrieve collections",
        details: err.message,
      });
    }
  },

  async getItemDetails(req, res) {
    const collectionId  = parseInt(req.params.id, 10)
    try {
      const collectionItemsWithWords = await CollectionItems.findAll({
        where: { collectionId: collectionId },
        include: [
          {
            model: Word,
            attributes: ['slug', 'kanji', 'kana', 'jlpt_level']
          }
        ]
      })

      const response = {
        collectionItemsWithWords
      }

      res.json(response);
    } catch (err) {
      res.status(500).json({
        error: "Failed to retrieve words",
        details: err.message,
      });
    }
  }
};



