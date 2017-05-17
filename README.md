# todo-redis

this is a simple implementation for a todo app api. 

**currently under development, right now most of the stuff is not implemented. uploading it step by step.**

## tech stack
- node/express as software layer
- redis for db persistence
  - which runs in a docker container
- supertest for http based testing
- chai for unit based testing


## todo
- testing (unit & http) of new fetaures
- promise chaining & promises needs rework
- es6 arrows at promises in redis-lowlevel
- unit testing
  - ramp up script for testing (redis spin up, data generation(build with testing?))
  - start db and api on different ports
- http testing
- db layout doc
- script for filling redis with sample data
- DOC
- build up user & notebook objects (data model), see express mvc or data modelling
- user status checking (for details, update, delete?)
- rework of function exporting
- code reorg to lib/
- input validation all fields 
  - post
  - request params
  - url parts
- functions / features:
  - ~~index page (page without auth)~~
  - ~~user~~
    - ~~userlist~~
    - ~~create / register user~~
    - ~~userstats (mail, name, status)~~
    - ~~activate user~~
    - ~~delete user~~
    - ~~update user~~
  - notebook
    - create notebook
    - delete notebook
    - rename / upddate notebook
    - notebook items
      - add item
      - delete item
      - change priority
      - update item



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

## example http calls
- register new user:
```
http POST localhost:3001/user name="randomuser" mail="mail@mail.de" password="x22222"
```

- activate user:
```
http -a mail@mail.de:x22222 http://localhost:3001/user/activation/1683_1494934471863
```

- get user details:
```
http -a mail@mail.de:x22222 http://localhost:3001/user/1
```

- delete user:
```
http -a mail@mail.de:x22222 DELETE http://localhost:3001/user/1
```

- update user:
```
http -a mail@mail.de:x22222 PUT http://localhost:3001/user/1 name="xxxrandomuser" mail="mail@mail.de" password="x22222"
```


## db schema
- keys:
  - next_user_id => last used id for a new user (simple counter)

- hashes:
  - user_list
    contains (key, value):
    - mail
    - id
    example:
    user_list => 
      - bla@bla.de: 1
      - bla2@bla2.de: 2

  - user:userid
    containes (key,value):
    - mail
    - name
    - status
    - pwhash
    example:
    user:1 =>
      - mail: bla@bla.de
      - name: Paule
      - status: 0
      - pwhash: 58t4r4uh
    user:2 =>
      - mail: bla2@bla2.de
      - name: Paule2
      - status: 0
      - pwhash: 58t4r4uh

  - activation_link


