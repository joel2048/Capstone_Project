const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");

router.get(
  "/collections",
  collectionController.getAllCollections
);

router.post(
  "/collections/new",
  collectionController.newCollection
);

router.post(
  "/collections/edit",
  collectionController.editCollection
);

router.delete(
  "/collections/delete",
  collectionController.deleteCollection
);

router.get(
  "/collections/cards",
  collectionController.getCollectionItems
)

module.exports = router;