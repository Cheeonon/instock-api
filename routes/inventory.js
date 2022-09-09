const express = require("express");
const router = express.Router();
const fs = require("fs");
const crypto = require("crypto");
const inventory = "./data/inventories.json";
const warehouse = require("../data/warehouses.json");
const { json } = require("express");

function readInventory(inventory) {
  return JSON.parse(fs.readFileSync(inventory))
}

router.get("/", (req, res) => {
  res.send(readInventory(inventory));
});

function findWarehouseId(warehouseName) {
  const warehouseFile = fs.readFileSync("./data/warehouses.json");
  const warehouseData = JSON.parse(warehouseFile);
  const warehouseObj = warehouseData.find((warehouse) => {
    return warehouse.name === warehouseName;
  });

  return warehouseObj.id;
}

router.get("/:inventoryId", (req, res) => {
  const inventoryDetails = readInventory(inventory);

  const inventoryDetail = inventoryDetails.find((inventory) => {
    return inventory.id === req.params.inventoryId;
  });

  res.send(JSON.stringify(inventoryDetail));
});

router.delete("/:inventoryid", (req, res) => {
  inventoryId = req.params.inventoryid;
  const inventoryDetails = readInventory(inventory);
  const newInventory = inventoryDetails.filter(
    (deet) => inventoryId !== deet.id
  );
  fs.writeFileSync("./data/inventories.json", JSON.stringify(newInventory));
  res.send("deleted successfully");
});
router.post("/add", (req, res) => {
  const newItem = {
    id: crypto.randomUUID(),
    warehouseID: findWarehouseId(req.body.warehouseName),
    warehouseName: req.body.warehouseName,
    itemName: req.body.itemName.trim(),
    description: req.body.description.trim(),
    category: req.body.category,
    status: req.body.status,
    quantity: req.body.quantity,
  };

  if (newItem.itemName && newItem.description && newItem.quantity >= 0) {
    const inventoryDetails = readInventory(inventory);
    inventoryDetails.push(newItem);

    fs.writeFileSync(
      "./data/inventories.json",
      JSON.stringify(inventoryDetails)
    );
    res.status(201).send(JSON.stringify(newItem));
  } else {
    res.status(400).send({ message: `ERROR BAD REQUEST` });
  }
});

module.exports = router;
