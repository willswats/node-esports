import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import flash from 'connect-flash';

import gameRoutes from './routes/game.js';
import playerRoutes from './routes/player.js';

const port = 3000;
const app = express();
const __filename = url.fileURLToPath(import.meta.url);

// Setup url for ejs
app.use((req, res, next) => {
  res.locals.url = req.originalUrl;
  res.locals.host = req.get('host');
  res.locals.protocol = req.protocol;
  next();
});

// Setup session and flash
app.use(
  session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      httpOnly: true,
      // secure: true, - breaks connect-flash
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Serve static files
app.use(express.static(path.join(path.dirname(__filename), 'public')));

// Setup views and view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(__filename), 'views'));

// Setup routes
app.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home',
  });
});
app.use('/games', gameRoutes);
app.use('/players', playerRoutes);
app.get('*', (req, res) => {
  res.render('pages/404', {
    title: '404 - Page not found',
  });
});

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    return console.log(`Error: ${error}`);
  }
  console.log(`Server listening on port ${server.address().port}`);
});
