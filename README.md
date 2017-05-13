# todo-redis

this is a simple implementation for a todo app api. 

## tech stack
- node/express as software layer
- redis for db persistence
  - which runs in a docker container
- supertest for http based testing
- chai for unit based testing


## todo
- unit testing
- http testing
- redis docker
- db layout
- passwords mit bcrypt & db salting
- script for filling redis with sample data
- DOC
- input validation all fields 
  - post
  - request params
  - url parts)
- functions / features:
  - user
    - userlist
    - create / register user
    - activate user
    - delete user
    - update user
  - notebook
    - create notebook
    - delete notebook
    - rename / upddate notebook
    - notebook items
      - add item
      - delete item
      - change priority



## setup
- install:

```
npm install
```

- start api:

```
npm start
# or
nodemon index.js
```

- start redis:

```
docker run --name redis -it -p 6379:6379 redis
# will run on port 6379 per default
```

## db schema
keys:
next_user_id => last used id for a new user

sets:
user_list (simple list) => username, userid, username, userid
=> user_list :: 'greg', '10'
user:userid (more complex list) => contains name, mail, pass...
=> user:100 :: 'name': greg, 'mail': 'mail@dasd.de'

