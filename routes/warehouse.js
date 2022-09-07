const express = require('express');
const router = express.Router();
const fs = require('fs');
const warehouse = require('../data/warehouses.json')

router.get("/", (req,res)=>{
    res.send(JSON.stringify(warehouse))
})

router.get ("/:warehouseid", (req, res) => {
    warehouseId = req.params.warehouseid
    const foundWarehouse = warehouse.find((house)=>{
        if (house.id === warehouseId) {
            return house
        }
    })
    res.send(foundWarehouse)
})

module.exports = router;