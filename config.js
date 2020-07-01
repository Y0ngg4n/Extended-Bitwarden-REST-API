// !!! DONT USE 6 (number 6) in name because the usernames email adress @ (at) sign gets replaced with a 6 !!!
const slave_docker_image_name="extended-bitwarden-rest-api-slave"
const slave_docker_image_name_replacement_char='6'
const container_prefix="ebwras-"

module.exports = {
    slave_docker_image_name,
    slave_docker_image_name_replacement_char,
    container_prefix
}