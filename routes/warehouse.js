const express = require('express');
const router = express.Router();
const fs = require('fs');
const warehouse = require('../data/warehouses.json')

router.get("/", (req,res)=>{
    res.send(JSON.stringify(warehouse))
})

module.exports = router;