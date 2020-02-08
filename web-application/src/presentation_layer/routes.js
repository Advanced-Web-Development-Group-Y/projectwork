const express = require('express');
const accountManager = require('../business_layer/accountManager');
const postManager = require('../business_layer/postManager');
const router = express.Router();
const bcrypt = require('bcrypt');
//All routers

const auth = (request, response, next) => {
    if (!request.session.isLoggedIn) {
        response.redirect('/login');
    } else next();
};

router.get('/', (request, response) => {
    response.render('landing.hbs', { layout: 'landing.hbs' });
});
router.get('/posts', (request, response) => {
    postManager.getAllPosts((error, posts) => {
        if (error) {
            const model = {
                somethingWentWrong: true
            };
            response.render('posts.hbs', model);
        } else {
            const model = {
                somethingWentWrong: false,
                isLoggedIn: request.session.isLoggedIn,
                posts
            };
            response.render('posts.hbs', model);
        }
    });
});
router.get('/post/new', auth, (request, response) => {
    response.render('addnew.hbs');
});
router.get('/post/:id', (request, response) => {
    postManager.getPost(request.params.id, (error, post) => {
        if (error) {
            const model = {
                somethingWentWrong: true
            };
            response.render('post.hbs', model);
        } else {
            const model = {
                somethingWentWrong: false,
                post
            };
            response.render('post.hbs', model);
        }
    });
});

router.get('/login', (request, response) => {
    if (request.session.isLoggedIn) response.redirect('/posts');
    else response.render('login.hbs', { layout: 'noappbar.hbs' });
});
router.get('/register', (request, response) => {
    response.render('register.hbs', { layout: 'noappbar.hbs' });
});
router.get('/profile/:userId', (request, response) => {
    accountManager.getAccountById(request.params.userId, (error, user) => {
        if (error || user.length === 0) {
            const model = {
                somethingWentWrong: true
            };
            response.render('profile.hbs', model);
        } else {
            const model = {
                somethingWentWrong: false,
                user
            };
            response.render('profile.hbs', model);
        }
    });
});
router.get('/profile', auth, (request, response) => {
    response.render('profile.hbs', { user: request.session.user });
});
router.get('/about', (request, response) => {
    response.render('about.hbs');
});
router.get('/logout', (request, response) => {
    request.session.isLoggedIn = false;
    request.session.user = null;
    response.redirect('/');
});

router.get('/post/update/:id', (request, response) => {
    if (request.session.isLoggedIn) {
        postManager.getPost(request.params.id, (error, post) => {
            if (error) {
                response.redirect('/posts');
            } else {
                response.render('updatepost.hbs', { post });
            }
        });
    } else {
        response.redirect('/login');
    }
});

router.get('*', (request, response) => {
    response.render('404.hbs');
});

router.post('/login', (request, response) => {
    accountManager.login(request.body, (error, user) => {
        if (error) {
            response.render('login.hbs', { layout: 'noappbar.hbs', error });
        } else {
            request.session.isLoggedIn = true;
            request.session.user = user;
            response.redirect('/posts');
        }
    });
});
router.post('/register', (request, response) => {
    accountManager.register(request.body, error => {
        if (error) {
            response.render('register.hbs', { layout: 'noappbar.hbs', error });
        } else {
            response.redirect('/login');
        }
    });
});

router.post('/post/new', (request, response) => {
    if (request.session.isLoggedIn) {
        var post = {
            posterid: request.session.user[0].userid,
            title: request.body.title,
            description: request.body.descriptionInput,
            platform: request.body.platformInput
        };

        postManager.addPost(post, error => {
            if (error) {
                response.render('addnew.hbs', { error, post });
            } else {
                response.redirect('/posts');
            }
        });
    } else {
        response.redirect('/login');
    }
});

router.post('/post/update/:id', (request, response) => {
    if (request.session.isLoggedIn) {
        const post = {
            title: request.body.titleInput,
            content: request.body.descriptionInput,
            postid: request.params.id
        };
        postManager.updatePost(post, error => {
            if (error) {
                console.log(post, error);

                response.render('updatepost.hbs', { error, post });
            } else {
                response.redirect('/post/' + request.params.id);
            }
        });
    } else {
        response.redirect('/login');
    }
});

module.exports = router;
