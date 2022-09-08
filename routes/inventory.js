const express = require("express");
const router = express.Router();
const fs = require("fs");
const inventory = require("../data/inventories.json");

function readInventory() {
  const inventoryFile = fs.readFileSync("./data/inventories.json");
  const inventoryData = JSON.parse(inventoryFile);
  return inventoryData;
}

router.get("/", (req, res) => {
  res.send(JSON.stringify(inventory));
});

router.get("/:inventoryId", (req, res) => {
  const inventoryDetails = readInventory();

  const inventoryDetail = inventoryDetails.find((inventory) => {
    return inventory.id === req.params.inventoryId;
  });

  res.send(JSON.stringify(inventoryDetail));
});

module.exports = router;
