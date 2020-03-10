const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = new Sequelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Post = sequelize.define('posts', {
    title: Sequelize.TEXT,
    content: Sequelize.TEXT,
    posterid: Sequelize.INTEGER,
    platform: Sequelize.TEXT,
    views: Sequelize.INTEGER,
    currency: Sequelize.TEXT,
    price: Sequelize.INTEGER
})

sequelize.sync()
module.exports = ({}) => {
    return {
        getAllPosts: callback => {
            Post.findAll({ raw: true, order: [['id', 'DESC']] })
                .then(posts => {
                    callback(null, posts)
                })
                .catch(error => {
                    callback(error)
                })
        },
        getAllFilteredPosts: (searchQuery, callback) => {
            if (searchQuery.keyword && searchQuery.platform) {
                Post.findAll({
                    raw: true,
                    order: [['id', 'DESC']],
                    where: {
                        title: { [Op.like]: `%${searchQuery.keyword}%` },
                        platform: { [Op.like]: `%${searchQuery.platform}%` }
                    }
                })
                    .then(posts => {
                        callback(null, posts)
                    })
                    .catch(error => {
                        console.log(error)
                        callback(error)
                    })
            } else if (searchQuery.keyword && !searchQuery.platform) {
                Post.findAll({
                    raw: true,
                    order: [['id', 'DESC']],
                    where: { title: { [Op.like]: `%${searchQuery.keyword}%` } }
                })
                    .then(posts => {
                        callback(null, posts)
                    })
                    .catch(error => {
                        console.log(error)
                        callback(error)
                    })
            } else if (!searchQuery.keyword && searchQuery.platform) {
                Post.findAll({
                    raw: true,
                    order: [['id', 'DESC']],
                    where: {
                        platform: { [Op.like]: `%${searchQuery.platform}%` }
                    }
                })
                    .then(posts => {
                        callback(null, posts)
                    })
                    .catch(error => {
                        console.log(error)
                        callback(error)
                    })
            }
        },
        getPost: (id, callback) => {
            Post.findByPk(id, { raw: true })
                .then(post => {
                    callback(null, [post])
                })
                .catch(error => {
                    callback(error)
                })
        },
        addPost: (post, callback) => {
            Post.create({
                title: post.title,
                content: post.content,
                posterid: post.posterid,
                platform: post.platform,
                currency: post.currency,
                price: post.price
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },
        updatePost: (post, callback) => {
            Post.update(
                {
                    title: post.title,
                    content: post.content,
                    currency: post.currency,
                    platform: post.platform,
                    price: post.price
                },
                { where: { id: post.postid } }
            )
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },

        deletePostById: (id, callback) => {
            Post.destroy({
                where: { id: id }
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },

        getAllPostsByUser: (userid, callback) => {
            Post.findAll({ raw: true, where: { posterid: userid } })
                .then(posts => {
                    callback(null, posts)
                })
                .catch(error => {
                    callback(error)
                })
        },

        incrementViewCountByPostId: (postid, callback) => {
            Post.findOne({ raw: true, where: { id: postid } })
                .then(post => {
                    let id = post.id
                    let count = post.views + 1
                    Post.update({ views: count }, { where: { id: id } }).catch(
                        error => {
                            callback(error)
                        }
                    )
                })
                .catch(error => {
                    callback(error)
                })
        }
    }
}
