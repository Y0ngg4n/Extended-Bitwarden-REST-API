const config = require('../config')

const getContainerName = (username) => {
    return config.container_prefix + username.replace('\@', config.slave_docker_image_name_replacement_char)
}

module.exports = {
    getContainerName
}