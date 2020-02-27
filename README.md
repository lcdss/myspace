# Myspace

Simple user's CRUD using **Lumen Framework** to build the API and **React Create App** with Typescript in the frontend.

## Quick Start

You will need have Docker and Docker Compose installed in your system to be able to follow the steps below:

- Clone the git repository
  ```bash
  $ git clone git@gitlab.com:lcdss/myspace.git
  ```
- Access the project root directory

  ```bash
  $ cd myspace
  ```

- Push, build and run the docker containers

  ```bash
  $ docker-compose up -d
  ```

- Access the api container

  ```bash
  $ docker-compose exec api sh
  ```

- Install the API dependencies

  ```bash
  $ composer install
  ```

- Copy the example environment file

  ```bash
  $ cp .env.example .env
  ```

- Create a symbolic link from public app storage to public directory

  ```bash
  $ ln -s $PWD/storage/app/public $PWD/public/storage
  ```

- Run the api server - It'll be available at http://api.myspace.local

  ```bash
  $ php -S 0.0.0.0 -t public
  ```

- In another terminal, access the client container

  ```bash
  $ docker-compose exec client sh
  ```

- Install the client dependencies

  ```bash
  $ yarn
  ```

- Copy the client example environment file

  ```bash
  $ cp .env.example .env.local
  ```

- Run the client server - It'll be available at http://myspace.local

  ```bash
  $ yarn start
  ```

- Add the api and client hostnames to your system's host file (_needs root access_)
  ```bash
  $ echo "127.0.0.1 myspace.local" >> /etc/hosts
  $ echo "127.0.0.1 api.myspace.local" >> /etc/hosts
  $ echo "127.0.0.1 cdn.myspace.local" >> /etc/hosts
  ```

## DEMO

**API**: https://api-myspace.herokuapp.com

**Client**: https://client-myspace.herokuapp.com

## What was used?

- [Lumen](https://lumen.laravel.com/)
- [React ⚛️](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Material UI](https://material-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Axios](https://github.com/axios/axios)
