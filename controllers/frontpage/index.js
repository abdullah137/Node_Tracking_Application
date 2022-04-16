const homePage = (req, res) => {
    res.render('frontend/index');
}

const aboutPage =  (req, res) => {
    res.render('frontend/about');
}

const contactPage =  (req, res) => {
    res.render('frontend/contact');
}

const error404 =  (req, res) => {
    res.status(404).render('errors/404')
};

const error403 = (req, res) => {
    res.status(403).render('errors/403')
}

const error400 = (req, res) => {
    res.status(400).render('errors/400')
}

const error500 =  (req, res) => {
    res.status(500).render('errors/500')
}

const error503 =  (req, res) => {
    res.status(503).render('errors/503')
}

const unknown =  (req, res) => {
    res.status(404).render('errors/404')
}

module.exports = {
    homePage,
    aboutPage,
    contactPage,
    error404,
    error400,
    error403,
    error500,
    error503,
    unknown
}