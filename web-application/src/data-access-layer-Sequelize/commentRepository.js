const Sequelize = require('sequelize')
const sequelize = new Sequelize('webAppDatabase', 'root', 'elpassword123', {
    host: 'database',
    dialect: 'mysql'
})
const Comment = sequelize.define('comments', {
    content: Sequelize.TEXT,
    postid: Sequelize.INTEGER,
    psterid: Sequelize.INTEGER,
    permission_level: Sequelize.INTEGER
})
sequelize.sync()

module.exports = ({}) => {
    return {}
}
