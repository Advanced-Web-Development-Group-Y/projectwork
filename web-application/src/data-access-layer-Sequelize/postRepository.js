const Seqeuelize = require('sequelize')
const sequelize = new Seqeuelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Post = sequelize.define('posts', {
    title: Seqeuelize.TEXT,
    content: Seqeuelize.TEXT,
    posterid: Seqeuelize.INTEGER,
    platform: Seqeuelize.TEXT,
    views: Seqeuelize.INTEGER
})

sequelize.sync()
module.exports = ({}) => {
    return {
        getAllPosts: callback => {
            Post.findAll({ raw: true })
                .then(posts => {
                    callback(null, posts)
                })
                .catch(error => {
                    callback(error)
                })
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
                platform: post.platform
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },
        updatePost: (post, callback) => {
            Post.update(
                { title: post.title, content: post.content },
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