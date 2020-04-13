curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"name": "Top 10 ES6 Features", "url":"http://webapplog.com/es6", "text": ""}' \
     "http://localhost:3000/posts"

curl -H 'Content-Type: application/json' \
     -X PUT \
     -d '{"name": "Top 10 ES6 Features Every Developer Must Know", "url":"http://webapplog.com/es6", "text": ""}' \
     "http://localhost:3000/posts/0"

curl "http://localhost:3000/posts"

curl -X DELETE "http://localhost:3000/posts/0"
