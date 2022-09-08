const { randomUUID } = require('crypto');
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

router.delete ("/:warehouseid", (req, res) => {
    warehouseId = req.params.warehouseid
    const newWarehouses = warehouse.filter(house => warehouseId !== house.id)
    fs.writeFileSync("./data/warehouses.json", JSON.stringify(newWarehouses))
    res.send("deleted successfully")
})

router.post("/add", (req, res) => {

    const warehouse = {
        "id": randomUUID(),
        "name": req.body.name,
        "address": req.body.address,
        "city": req.body.city,
        "country": req.body.country,
        "contact": {
          "name": req.body.contactName,
          "position": req.body.position,
          "phone": `+1 ${req.body.phoneNumber}`,
          "email": req.body.email
        }
      }

      console.log(warehouse);
      const warehouseList = fs.readFileSync("./data/warehouses.json");
      const warehouseListData = JSON.parse(warehouseList);
      warehouseListData.push(warehouse)
      console.log(warehouseListData)
      fs.writeFileSync("./data/warehouses.json", JSON.stringify(warehouseListData));

      res.status(201).send(JSON.stringify(warehouse))
})

module.exports = router;