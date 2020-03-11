const Sequelize = require('sequelize')
const sequelize = new Sequelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Comment = sequelize.define('comments', {
    content: Sequelize.TEXT,
    postid: Sequelize.INTEGER,
    posterid: Sequelize.INTEGER,
    posterusername: Sequelize.TEXT
})
sequelize.sync()

module.exports = ({}) => {
    return {
        getPostCommentsByPostId: (id, callback) => {
            Comment.findAll({ raw: true, where: { postid: id } })
                .then(comments => {
                    callback(null, comments)
                })
                .catch(error => {
                    console.log(error)
                    callback(error)
                })
        },
        getCommentById: (id, callback) => {
            Comment.findByPk(id, { raw: true })
                .then(post => {
                    callback(null, [post])
                })
                .catch(error => {
                    callback(error)
                })
        },
        updateComment: (comment, callback) => {
            Comment.update(
                {
                    content: comment.content
                },
                { where: { id: comment.id } }
            )
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },

        deleteCommentById: (id, callback) => {
            Comment.destroy({
                where: { id: id }
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        },
        addComment: (comment, callback) => {
            Comment.create({
                content: comment.content,
                posterid: comment.posterid,
                posterusername: comment.posterusername,
                postid: comment.postid
            })
                .then(callback(null))
                .catch(error => {
                    callback(error)
                })
        }
    }
}
