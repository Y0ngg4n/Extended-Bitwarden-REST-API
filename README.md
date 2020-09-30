# Extended Bitwarden REST API

This Node.js REST API extends the [Bitwarden](https://bitwarden.com) REST API.
It works with Docker, Node.js Express and the [Bitwarden-CLI](https://github.com/bitwarden/cli).

The problem is that the default REST API does not contains the features to get and edit sensitive data.

The basic principle is that it spawns a docker container for each user, 
to provide session consistency for multiple users, and clears them on startup.

## Features:
  - Full Wrapper for all Bitwarden CLI Commands (excluding lock and unlock, because they are useless)
  - Session consistency
  - Multiple Users
  - Allways synced vault
  - Attachments

## How does it work?
At startup it clears all old docker container and rebuilds the image.
Then you can send different Requests to the REST API and it will provide you with the data needed.
So first you want to login.
The REST API will spawn a user specific Docker Container, logs you in and saves the bitwarden session key.
The session key is given with every commmand so it is don´t exposed to environment variables to avoid abuse.
When you want to search for a password for example you send your username and the search query to the REST API and the REST API will execute the specific bw-cli commands to get your data in your user specific docker container.

>[!WARNING]
>If you want to use this, watch out that you don´t make this server publicly available! For the best Security this REST API should be hosted on the same machine as your programm so your data is not delivered outside. You can also enable SSL/TLS on your web server to encrypt the requests. 

>[!WARNING]
>This REST API concatenates your requests to shell commands, so this can cause remote code execution if you use it on a publicly available server!

>This project is not associated with the Bitwarden project nor 8bit Solutions LLC.
>⚠️IMPORTANT⚠️: When using this  REST API, please report any bugs or suggestions to us directly (look at the bottom of this page for ways to get in touch), regardless of whatever clients you are using (mobile, desktop, browser...). DO NOT use the official support channels.

## Requests
I will provide a detailed Documentation of all Requests and sample Code soon.
If you want to use it just dig through the code and search the routes directory.
You will recognice the routes are the same as the bw-cli commands to get started read the [bw-cli docs](https://bitwarden.com/help/article/cli/) and compare them with the node.js express routes

## Tech

This REST API uses some dependencies to work:

* [Node.js](https://nodejs.org) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Docker](https://www.docker.com) - A cool container tool

And of course this REST API itself is open source with a [public repository](https://github.com/Y0ngg4n/Extended-Bitwarden-REST-API) on GitHub.

## Installation

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Node.js](https://nodejs.org/en/download/) (or use docker image)

```sh
git clone https://github.com/Y0ngg4n/Extended-Bitwarden-REST-API.git
cd Extended-Bitwarden-REST-API
npm start
```

### Development

Want to contribute? Great!

Just make a Pull Request or open an Issue!

### Docker
You can find the docker images at [Dockerhub](https://hub.docker.com/u/yonggan)
