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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialise PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// socket setup
let io = server_socket(server);

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('addDonation', data => {
        setTimeout(() => {
            io.sockets.emit('newDonation', data);
        }, 10);
    });
});

// Express routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/donate', (req, res) => {
    res.render('donate');
});