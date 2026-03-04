require('dotenv').config();
const restaurantsService = require('./services/restaurants');
const restaurantByIdService = require('./services/restaurantById');
const reviewService = require('./services/reviews');
const getReviewsService = require('./services/getReviews');
const locationService = require('./services/location');
const userService = require('./services/users');
const photoService = require('./services/photos');
const session = require('express-session');
const cors = require('cors');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { CityDoesNotExistError } = require('./errors');
const { EmailAlreadyExists } = require('./errors');
const { UserAlreadyExists } = require('./errors');
const path = require('path');

const port = process.env.PORT || 80;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

// comment out when deploying, if deploying from same orgin

const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
    })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1); // enable this if you run behind a proxy, like gcp

let redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    // Use rediss:// (TLS) — required by Upstash and most cloud Redis providers
    redisUrl = `rediss://${REDIS_USERNAME ? REDIS_USERNAME + ':' : ''}${REDIS_PASSWORD ? REDIS_PASSWORD + '@' : ''}${REDIS_HOST}:${REDIS_PORT}`
}

/*
const redisClient = redis.createClient({
    url: redisUrl,
});

redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
})
*/
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    url: redisUrl
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

// for local dev:
/*
app.use(session({
    store: new RedisStore({ client: redisClient }),
    //store: redisStore,
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
        secure: false,
        httpOnly: true,
        maxAge: 10000 * 60 * 10 // session max age in miliseconds
    }
}))
*/

//For deploy:
const isProd = process.env.NODE_ENV === 'production';
app.use(session({
    // Firebase Hosting's CDN strips every cookie EXCEPT __session before
    // forwarding requests to Cloud Run. Renaming the session cookie here
    // ensures it survives the Firebase → Cloud Run proxy hop.
    name: '__session',
    // prefix namespaces all session keys as  reviewsApp:sess:<sid>
    // so they never collide with keys written by other apps (e.g. weatherApp)
    store: new RedisStore({ client: redisClient, prefix: 'reviewsApp:sess:' }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: isProd ? 'None' : 'lax',  // 'None' needed for cross-origin in prod; 'lax' works on localhost
        secure: isProd,                      // true in prod (HTTPS), false locally (HTTP)
        httpOnly: true,
        maxAge: 10000 * 60 * 10
    }
}));


app.get('/api/debug-session', (req, res) => {
    console.log("Session:", req.session);
    res.send(req.session);
});

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from backend!" });
});


function isLoggedIn(req, res, next) {
    if (req.session.user) {
        console.log('user logged is logged in');
        next();
    } else {
        res.status(401).json({ message: 'You need to login to do this' });
    }
}

app.get('/api/searchUserRev', async (req, res) => {
    // console.log("made it here");
    try {
        //console.log("user", req.query.user);
        const resID = req.query.id;
        const username = req.query.user;
        const response = await reviewService.searchReview(username, resID);
        //console.log("res", response);
        res.json(response);
    } catch (error) {
        return res.status(400).send('searchRev error', error);
    }
})

app.delete('/api/deleteRev', async (req, res) => {
    try {
        const username = req.query.user;
        const id = req.query.id;
        const response = await reviewService.deleteReview(username, id);
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(400).send('delete error');
    }
});

app.post('/api/seeIfLoggedIn', (req, res) => {
    if (!req.session.user) {
        //console.log("HHHH");
        //console.log("");
        res.status(401).json({ message: 'user is not logged in' });
    } else {
        res.json({ message: 'User is logged in' });
    }
})

app.get('/api/getPhotos', (req, res) => {
    const photoReference = req.query.ref;
    photoService.getPhotos(photoReference).then(result => {
        res.json(result);
    }).catch(error => {
        return res.status(400).send('The request is bad', error);
    })

})

app.get('/api/getResReviews', (req, res) => {
    const id = req.query.id;
    getReviewsService.getReviews(id).then(result => {
        res.json(result);
    }).catch(error => {
        return res.status(400).send(error);
    })
})

app.post('/api/postReview', (req, res) => {
    const rating = req.body.rating;
    const id = req.body.id;
    const user = req.body.user;
    const review = req.body.review;
    //console.log("RR:", id, user, review);
    reviewService.addReview(rating, user, id, review).then(result => {
        res.json(result);
    }).catch(error => {
        console.log("EE", error);
        return res.status(400).send('error adding review: ' + error);
    })
})


app.get('/api/searchByGoogleId', (req, res) => {
    const id = req.query.id;
    restaurantByIdService.getRestaurantInfoById(id).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(err.response.status).json({ message: err.response.statusText });
    })
})

app.get('/api/myLocation', (req, res) => {
    locationService.getMyLocation().then(result => {
        res.json(result);
    }).catch(err => {
        res.status(err.response.status).json({ message: err.response.statusText });
    })
})

app.get('/api/geolocation', (req, res) => {
    const city = req.query.address;
    locationService.getCoordinates(city).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(err.response.status).json({ message: err.response.statusText });
    })
});

app.get('/api/restaurantsNearby', async (req, res) => {
    try {
        const city = req.query.address;
        const name = req.query.name;
        const nextPageToken = req.query.nextPageToken;
        const lat = req.query.lat;
        const lng = req.query.lng;
        //console.log("Lat and LNG:", lat, "  ", lng);
        const restaurantNames = await restaurantsService.getRestaurants(city, name, nextPageToken, lat, lng);
        res.json(restaurantNames);
    } catch (error) {
        if (error instanceof CityDoesNotExistError) {
            return res.status(501).send(error.message);
        }
        console.error(error);
        res.status(500).json({ message: "database error" });
    }
});

app.get('/api/userinfo', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const username = req.session.user.username;
    res.json({ username });
});


app.post('/api/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    userService.findUser(username, password).then(result => {
        if (!result) {
            console.log("HE");
            res.status(404).json({ message: "User not found" });
        } else {
            req.session.user = result.dataValues;
            console.log("User is authenticated");
            console.log(result.dataValues);
            console.log("Session after login:", req.session);
            res.status(200).json(result);
        }
    }).catch(error => {
        console.error(error);
        res.status(500).json({ message: "database error" });
    })
});

app.post('/api/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        //res.redirect("/")
        res.status(200).json({});
    });
})

app.post('/api/createUser', async (req, res) => {
    const username = req.body.username;
    //console.log("username", username);
    const password = req.body.password;
    //console.log("pass", password)
    const email = req.body.email;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Missing username, password, or email' });
    }
    userService.createUser(username, password, email).then(result => {
        res.status(201).json({ message: 'User added' });
    }).catch(error => {
        if (error instanceof EmailAlreadyExists) {
            return res.status(409).json({ message: error.message });
        }

        if (error instanceof UserAlreadyExists) {
            return res.status(409).json({ message: error.message });
        }

        res.status(500).json({ message: 'database error' });
    })
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
