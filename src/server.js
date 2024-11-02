const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('Morgan enabled...');
}

dotenv.config({
    path: './config.env'
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});