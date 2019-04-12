const express = require('express');
const server_socket = require('socket.io');
const path = require("path");
const bodyParser = require('body-parser');


// App setup
const app = express();

const server = app.listen(5000, () => {
    console.log('Listening at port 5000');
});

// static files
app.use(express.static('public'));

// Body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// socket setup
let io = server_socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    // socket.on('addDonation', data => {
    //     // save to mongodb 
    //     AddDonations(data);
    // });
});

// Express routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});