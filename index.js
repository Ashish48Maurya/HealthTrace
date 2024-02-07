require('dotenv').config();
const express = require('express');
const app = express();
const mongoConnect = require('./db');
const cors = require('cors');
const Product = require('./models/Products');
const port = 8000;

app.use(cors());
app.use(express.json());

app.post('/post', async (req, res) => {
    const { productID, prdName, batchNo, qrcode, manufactureDate, expirationDate } = req.body;
    if (!productID || !qrcode || !expirationDate) {
        return res.status(422).json({ error: 'All Fields Are Required!' });
    }
    try {
        const product = new Product({
            productID, prdName, batchNo, qrcode, manufactureDate, expirationDate
        });
        const item = await product.save();
        return res.status(200).json({ message: 'Product Added successfully!', item });
    } catch (err) {
        console.error(`Error sending message: ${err}`);
        return res.status(500).json({ error: `Internal Server Error -> ${err}` });
    }
})

app.get('/get/:id',async(req,res)=>{
    const {id} = req.params;
    console.log(id);
    try {
        const ans = await Product.find({productID:id});
        return res.status(200).json({ message: "true" , ans});
    } catch (err) {
        console.error(`Error sending message: ${err}`);
        return res.status(500).json({ error: `Internal Server Error -> ${err}` });
    }
})

mongoConnect(process.env.MONGO_URL).then(() => {

    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});