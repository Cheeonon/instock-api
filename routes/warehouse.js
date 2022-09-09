const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const fs = require('fs');
const warehouse = './data/warehouses.json'
const readFile = (data)=>{
   return JSON.parse(fs.readFileSync(data))
}

router.get("/", (req,res)=>{
    res.send(readFile(warehouse))
    console.log(readFile(warehouse))
   
})

router.get ("/:warehouseid", (req, res) => {
    warehouseId = req.params.warehouseid
    const foundWarehouse = readFile(warehouse).find((house)=>{
        if (house.id === warehouseId) {
            return house;
        }
    });
    res.send(foundWarehouse);
});

router.delete ("/:warehouseid", (req, res) => {
    warehouseId = req.params.warehouseid
    const newWarehouses = readFile(warehouse).filter(house => warehouseId !== house.id)
    fs.writeFileSync("./data/warehouses.json", JSON.stringify(newWarehouses))
    res.send("deleted successfully")
})

router.post("/add", (req, res) => {
    const warehouse = {
        id: randomUUID(),
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        contact: {
            name: req.body.contact.name,
            position: req.body.contact.position,
            phone: `+1 ${req.body.contact.phone}`,
            email: req.body.contact.email,
        },
    };

    // validation
    if (
        req.body.name &&
        req.body.address &&
        req.body.city &&
        req.body.country &&
        req.body.contact.name &&
        req.body.contact.position &&
        req.body.contact.phone &&
        req.body.contact.email
    ) {
        const warehouseList = fs.readFileSync("./data/warehouses.json");
        const warehouseListData = JSON.parse(warehouseList);
        warehouseListData.push(warehouse);
        fs.writeFileSync(
            "./data/warehouses.json",
            JSON.stringify(warehouseListData)
        );

        res.status(201).send(JSON.stringify(warehouse));
    } else {
        res.status(400).send({ message: `ERROR BAD REQUEST` });
    }
});

router.put("/:warehouseid", (req, res) => {
    const warehouseList = fs.readFileSync("./data/warehouses.json");

    const newWarehouseList = warehouseList.forEach((warehouse) => {
        if (warehouse.id === req.params.warehouseid) {
            warehouse.name = req.body.name;
            warehouse.address = req.body.address;
            warehouse.city = req.body.city;
            warehouse.country = req.body.country;
            warehouse.contact.name = req.body.name;
            warehouse.contact.position = req.body.position;
            warehouse.contact.phone = req.body.phone;
            warehouse.contact.email = req.body.email;
        }
    });
    
    // validation
    if (
        req.body.name &&
        req.body.address &&
        req.body.city &&
        req.body.country &&
        req.body.contact.name &&
        req.body.contact.position &&
        req.body.contact.phone &&
        req.body.contact.email
    ) {
        const warehouseList = fs.readFileSync("./data/warehouses.json");
        const warehouseListData = JSON.parse(warehouseList);
        warehouseListData.push(warehouse);
        fs.writeFileSync(
            "./data/warehouses.json",
            JSON.stringify(warehouseListData)
        );

        res.status(201).send(JSON.stringify(warehouse));
    } else {
        res.status(400).send({ message: `ERROR BAD REQUEST` });
    }

});

module.exports = router;
