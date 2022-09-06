require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.static('public'))
const cors = require('cors')
const inventoryRoutes = require("./routes/inventory.js")
const warehouseRoutes = require("./routes/warehouse.js")

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    next();
});

app.use("/inventory", inventoryRoutes);
app.use("/warehouse", warehouseRoutes);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});