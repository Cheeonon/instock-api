const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const warehouse = "./data/warehouses.json";
const readFile = (data) => {
    return JSON.parse(fs.readFileSync(data));
};

router.get("/", (req, res) => {
    try {
        res.send(readFile(warehouse));
    } catch {
        res.status(500).send({ message: "Unable to retrieve warehouse data" });
    }
});

router.get("/:warehouseid", (req, res) => {
    try {
        warehouseId = req.params.warehouseid;
        const foundWarehouse = readFile(warehouse).find((house) => {
            if (house.id === warehouseId) {
                return house;
            }
        });
        res.send(foundWarehouse);
    } catch {
        res.status(404).json({ message: "Warehouse not found" });
    }
});

router.delete("/:warehouseid", (req, res) => {
    try {
        warehouseId = req.params.warehouseid;
        const newWarehouses = readFile(warehouse).filter(
            (house) => warehouseId !== house.id
        );
        fs.writeFileSync(
            "./data/warehouses.json",
            JSON.stringify(newWarehouses)
        );
        res.send("deleted successfully");
    } catch {
        res.status(500).json({ message: "Unable to delete warehouse" });
    }
});

router.post("/add", (req, res) => {
    try {
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
        }
    } catch {
        res.status(500).json({ message: "Unable to create warehouse" });
    }
});

router.put("/:warehouseid/edit", (req, res) => {
    try{
        const warehouseList = fs.readFileSync("./data/warehouses.json", "utf8");
        const warehouseListData = JSON.parse(warehouseList);
    
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
            warehouseListData.forEach((warehouse) => {
                if (warehouse.id === req.params.warehouseid) {
                    warehouse.name = req.body.name;
                    warehouse.address = req.body.address;
                    warehouse.city = req.body.city;
                    warehouse.country = req.body.country;
                    warehouse.contact.name = req.body.contact.name;
                    warehouse.contact.position = req.body.contact.position;
                    warehouse.contact.phone = req.body.contact.phone;
                    warehouse.contact.email = req.body.contact.email;
                }
            });
    
            fs.writeFileSync(
                "./data/warehouses.json",
                JSON.stringify(warehouseListData)
            );
    
            res.status(201).send(JSON.stringify(warehouse));
        } 
    } catch{
        res.status(500).json({ message: "Unable to update warehouse" });
    }
    
});

module.exports = router;
