const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});