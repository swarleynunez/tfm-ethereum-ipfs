const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

// Variables
const port = process.env.PORT || 8081;
const app = express();

// Favicon
app.use(favicon(__dirname + '/dist/favicon.ico'));

// Configuration
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port);
