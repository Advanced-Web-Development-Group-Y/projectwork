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
    const postid = request.params.id

    postManager.incrementViewCountByPostId(postid, error => {
        if(error) {
            console.log("Error raising viewcount: ", error)
        }
    });

    postManager.getPost(postid, (error, post) => {
        if (error) {
            const model = {
                somethingWentWrong: true
            };
            response.render('post.hbs', model);
        } else {

            postManager.checkIfUsersPost(postid, (error, posterid) => {
                if (error) {
                    const model = {
                        somethingWentWrong: true,
                    };
                    response.render('post.hbs', model);
                } else {
                    let canEditPost = (posterid[0].posterid === request.session.user[0].userid) ? true : false;

                    if (request.session.user[0].permission_level === 1) {
                        canEditPost = true;
                    }

                    const model = {
                        somethingWentWrong: false,
                        canUserEditPost: canEditPost,
                        post
                    };
                    response.render('post.hbs', model);
                }
            })
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
    postManager.getAllPostsByUser(request.session.user[0].userid, (error, posts) => {
        if (error) {

        } else {
            response.render('profile.hbs', { user: request.session.user, posts });
        }
    })
});
router.get('/about', (request, response) => {
    response.render('about.hbs');
});
router.get('/logout', (request, response) => {
    request.session.isLoggedIn = false;
    request.session.user = null;
    response.redirect('/');
});

router.get('/post/update/:id', auth, (request, response) => {
    postManager.getPost(request.params.id, (error, fetchedPost) => {
        if (error) {
            response.redirect('/posts');
        } else {
            const post = {
                postid: fetchedPost[0].postid,
                title: fetchedPost[0].title,
                content: fetchedPost[0].content
            }
            response.render('updatepost.hbs', { post });
        }
    });
}); 

router.get('/post/delete/:id', auth, (request, response) => {
    postManager.deletePostById(request.params.id, error => {
        if (error) {
            response.redirect('/posts')
        } else {
            response.redirect('/posts')
        }
    });
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

router.post('/post/new', auth, (request, response) => {
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
});

router.post('/post/update/:id', auth, (request, response) => {
    const post = {
        title: request.body.titleInput,
        content: request.body.descriptionInput,
        postid: request.params.id
    };
    postManager.updatePost(post, error => {
        if (error) {
            response.render('updatepost.hbs', { error, post });
        } else {
            response.redirect('/post/' + request.params.id);
        }
    });
});

module.exports = router;
