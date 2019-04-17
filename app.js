const express = require('express');
const server_socket = require('socket.io');
const path = require("path");
const bodyParser = require('body-parser');
const fs = require("fs");

// App setup
const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('Listening at port ' + PORT);
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
        read((err, content) => {
            if (err) console.log(err);
            console.log(content)
            prvAmount = Number(content);
            let _amount;
            if(Number(data.amount) == -1) {
                // erase all donations
                _amount = 0;
            } else {
                _amount = prvAmount + data.amount;
            }
            write(_amount, (err) => {
                if (err) console.log(err);
                io.sockets.emit('newDonation', {
                    amount: _amount
                });
            });
        });
    });
});

// Express routes
app.get('/', (req, res) => {
    setTimeout(() => {
        read((err, content) => {
            if (err) console.log(err);
            prvAmount = Number(content);
            io.sockets.emit('newDonation', {
                amount: prvAmount
            });
        });
    }, 1000);
    res.render('index');
});

app.get('/donate', (req, res) => {
    res.render('donate');
});

// read amount from file
let read = async (callback) => {
    fs.readFile('temp.txt', 'utf8', callback);
}

// write amount to file
let write = async (amount, callback) => {
    fs.writeFile('temp.txt', amount, callback);
}
