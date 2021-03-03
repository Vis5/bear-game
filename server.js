'use strict';
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSwagger = require('express-swagger-generator')(app);
const srvConfig = require('./config');
const mongoose = require('mongoose');
const {CONNECTION_TYPE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME, DB_QUERY_PARAMS} = srvConfig;
const dbAuthString = (DB_USERNAME && DB_PASSWORD) ? `${srvConfig.DB_USERNAME}:${srvConfig.DB_PASSWORD}@` : '';
let httpServer;
var cron = require('node-cron');

/**
 * Configure middleware
 */
app.use(
    cors({
        // origin: `http://localhost:${srvConfig.SERVER_PORT}`,
        origin: function (origin, callback) {
            return callback(null, true)
        },
        optionsSuccessStatus: 200,
        credentials: true
    }),
    session({
        saveUninitialized: true,
        secret: srvConfig.SESSION_SECRET,
        resave: true
    }),
    cookieParser(),
    bodyParser.json()
);

/**
 * Include all API Routes
 */
app.use('/api', require('./routes/api'));

/**
 * Swagger UI documentation
 */
if (srvConfig.SWAGGER_SETTINGS.enableSwaggerUI)
    expressSwagger(srvConfig.SWAGGER_SETTINGS);

/**
 * Configure http(s)Server
 */
if (srvConfig.HTTPS_ENABLED) {
    const privateKey = fs.readFileSync(srvConfig.PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(srvConfig.CERTIFICATE_PATH, 'utf8');
    const ca = fs.readFileSync(srvConfig.CA_PATH, 'utf8');

    // Create a HTTPS server
    httpServer = https.createServer({key: privateKey, cert: certificate, ca: ca}, app);
} else {
    // Create a HTTP server
    httpServer = http.createServer({}, app);
}

/**
 * Start http server & connect to MongoDB
 */
httpServer.listen(srvConfig.SERVER_PORT, () => {
    mongoose.connect(`${CONNECTION_TYPE}://${dbAuthString}${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_QUERY_PARAMS}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log(`Server started on port ${srvConfig.SERVER_PORT}`);
    });
});

/**
 * Socket.io section
 */
const io = require('socket.io')(httpServer);
const seedrandom = require('seedrandom');
const queueInSec = 30;
const gsap = require("gsap");
var prng = seedrandom("seed");

var rooms = new Map();
/*cron.schedule('* * * * *', () => {
    console.log("Scheduling");
    rooms.forEach(function (value, key, map) {
        socket.to(key).emit("gameover", "You win!");
        console.log(value);
    });
});*/

io.on('connection', function (socket) {
    console.log(` New conn: ${socket.id}`);

    socket.on('join', (room) => {
        console.log("JOINED ROOM");
        console.log(room);
        initRoom(room);
        rooms.get(room).members.push(socket.id);
        socket.join(room);
    });

    socket.on('start', (room) => {
        initRoom(room);
        startQueue(room);
        setTimeout(() => stopQueue(room), waitingInSec * 1000);
    });

    socket.on('bet', (room, msg) => {
        console.log(msg);
        console.log(socket.rooms);
    });

    socket.on('dev:start', (room) => {
        initRoom(room);
        startGame(room);
    });
    
    function initRoom(room) {
        if (!rooms.has(room)) {
            rooms.set(room, {
                "members": [],
                "bears": [0, 0, 0, 0],
                "winner": 0,
                "betting": true //default should be false
            });
        }
    }

    function startGame(room) {
        // socket.in(room).emit("startRace", "seed");
        initRoom(room);
        socket.emit("startRace", room);
        prng = seedrandom(room);
        tween(room, 0);
    }

    function tween(room) {
        var finish = false;
        for (var i=0; i<rooms.get(room).bears.length; i++) {
            rooms.get(room).bears[i] +=  Math.floor(prng() * 130 - 10);
            if (rooms.get(room).bears[i] > 650) {
                console.log("WINNER" + (i+1));
                rooms.get(room).wiiner = i+1;
                finish = true;
            }
        }
        if (!finish) {
            tween(room);
        }
    }

    function startQueue(room) {
        rooms.get(room).betting = false;
        // setTimeout(() => startgame(room), queueInSec * 1000);
    }

    function stopQueue(room) {
        rooms.get(room).betting = false;
        startGame(room);
    }

    socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
});

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});  