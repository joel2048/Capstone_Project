const collectionService = require("../services/collectionService");

module.exports = {
  getAllCollections: (req, res) =>
    collectionService.getAllCollections(req, res),

  newCollection: (req, res) =>
    collectionService.newCollection(req, res),

  editCollection: (req, res) =>
    collectionService.editCollection(req, res),

  deleteCollection: (req, res) =>
    collectionService.deleteCollection(req, res),

  getCollectionItems: (req, res) =>
    collectionService.getCollectionItems(req, res),

  getItemDetails: (req, res) =>
    collectionService.getItemDetails(req, res),

  postSwipeLeft: (req, res) =>
    collectionService.postSwipeLeft(req, res),

  postSwipeRight: (req, res) =>
    collectionService.postSwipeRight(req, res),
};