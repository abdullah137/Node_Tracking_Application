const express = require('express');
const router = express.Router();

const { homePage, aboutPage, contactPage, error404, error400, error403, error500, error503} = require('../../controllers/frontpage/index');

router.get('/', homePage);

router.get('/about-us', aboutPage);

router.get('/contact-us', contactPage);

router.get('/error/404', error404);

router.get('/error/400', error400);

router.get('/error/403', error403);

router.get('/error/500', error500);

router.get('/error/503', error503);

module.exports = router;