const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto')
const inventory = require('../data/inventories.json')
const warehouse = require('../data/warehouses.json')

function readInventory() {
    const inventoryFile = fs.readFileSync('./data/inventories.json')
    const inventoryData = JSON.parse(inventoryFile)
    return inventoryData
}

function findWarehouseId(warehouseName) {
    const warehouseFile = fs.readFileSync('./data/warehouses.json');
    const warehouseData = JSON.parse(warehouseFile);
    const warehouseObj = warehouseData.find((warehouse) => {
        return warehouse.name === warehouseName;
    })

    return warehouseObj.id

}

router.get("/", (req,res)=>{
    res.send(JSON.stringify(inventory))
})

router.get("/:inventoryId", (req,res)=>{
    const inventoryDetails = readInventory();

    const inventoryDetail = inventoryDetails.find((inventory) => {
        return inventory.id === req.params.inventoryId;
    })

    res.send(JSON.stringify(inventoryDetail));

})

router.post("/add", (req, res) => {
    const newItem = {
        id: crypto.randomUUID(),
        warehouseID: findWarehouseId(req.body.warehouseName),
        warehouseName: req.body.warehouseName,
        itemName: req.body.itemName.trim(),
        description: req.body.description.trim(),
        category: req.body.category,
        status: req.body.status,
        quantity: req.body.quantity
    }

    if (newItem.itemName && newItem.description && newItem.quantity>=0){
        const inventoryDetails = readInventory();
        inventoryDetails.push(newItem);

        fs.writeFileSync("./data/inventories.json", JSON.stringify(inventoryDetails));
        res.status(201).send(JSON.stringify(newItem));
    } else {
        res.status(400).send({message:`ERROR BAD REQUEST`});
    }

    
})


module.exports = router;