const { postSwipeLeft } = require("../controllers/collectionController");
const { Collection, CollectionItems, Word, User } = require("../models");
const db = require("../models");

module.exports = {
  async getAllCollections(req, res) {
    const auth0_id = req.auth.sub;
    console.log(auth0_id)
    try {

      // Find the internal user ID
      const user = await User.findOne({ where: { auth0_id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const { count, rows: allCollections } = await Collection.findAndCountAll({
      attributes: ["collectionId", "collectionName", "userId", "cardTotal"]
      });

      const collections = allCollections.filter(
        (c) => c.userId === null || c.userId === user.userId
      );

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
    const { wordList, name } = req.body;
    const t = await db.sequelize.transaction();

    const auth0_id = req.auth.sub;
    console.log(auth0_id)

    const user = await User.findOne({ where: { auth0_id } });
    console.log(user)
    if (!user) return res.status(404).json({ error: "User not found" });

    try {
      const newCollection = await Collection.create(
        {
          collectionName: name,
          userId: user.userId,
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
      res.json("successfully added new collection");
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

  async editCollection(req, res) {                  //should probably edit this to not destroy and bulkCreate and add row instead
    const { collectionId, newWordList } = req.body;
    const t = await db.sequelize.transaction();

    try {
      if (collectionId === 1 || collectionId === 2 || collectionId === 3) {
        res.json("editing this collection is not permitted");
      } else {
      const updatedCollection = await Collection.update(
        {
          cardTotal: newWordList.length
        },
        { where: { collectionId: collectionId }, transaction: t }
      );

    await CollectionItems.destroy({
      where: { collectionId },
      transaction: t
    });

    await CollectionItems.bulkCreate(
      newWordList.map(slug => ({
        slug: slug.trim(),
        collectionId
      })),
      { transaction: t }
    );

    await t.commit();
    res.json({ success: true, collectionId });
    }} catch (err) {
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
    console.log(collectionId)
    try {
      const collectionItemsWithWords = await CollectionItems.findAll({
        where: { collectionId: collectionId },
        include: [
          {
            model: Word,
            attributes: ['slug', 'kanji', 'kana', 'meaning', 'jlpt_level']
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
  },

  async postSwipeLeft(req, res) {
    const { slug } = req.body;
    const auth0_id = req.auth.sub

    try {
      const user = await User.findOne({ where: { auth0_id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      let userWord = await db.UserWord.findOne({
        where: { userId: user.userId, slug },
      })

      if (userWord) {
        await userWord.increment("times_unknown", { by: 1 });
      } else {
        // create entry if it doesn't exist
        userWord = await db.UserWord.create({
          userId: user.userId,
          slug,
          times_unknown: 1,
          times_known: 0,
        });
      }

      res.json({ message: "Swipe recorded", userWord });
    } catch (err) {
      if (!t.finished) {
        await t.rollback();
      }
      res.status(500).json({
        error: "Failed record swipe",
        details: err.message,
      });
    }
  },

    async postSwipeRight(req, res) {
    const { slug } = req.body;
    const auth0_id = req.auth.sub

    try {
      const user = await User.findOne({ where: { auth0_id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      let userWord = await db.UserWord.findOne({
        where: { userId: user.userId, slug },
      })

      if (userWord) {
        await userWord.increment("times_known", { by: 1 });
      } else {
        // create entry if it doesn't exist
        userWord = await db.UserWord.create({
          userId: user.userId,
          slug,
          times_unknown: 0,
          times_known: 1,
        });
      }

      res.json({ message: "Swipe recorded", userWord });
    } catch (err) {
      if (!t.finished) {
        await t.rollback();
      }
      res.status(500).json({
        error: "Failed record swipe",
        details: err.message,
      });
    }
  },
};



