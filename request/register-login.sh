curl --location 'http://localhost:3001/api/auth/register' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Luis Edin",
  "phoneNumber": "+51915024829"
}'

curl --location 'http://localhost:3001/api/auth/verify-registration' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Luis Edin",
  "phoneNumber": "+51915024829",
  "code": "123456"
}'

curl --location 'http://localhost:3001/api/auth/login' \
--header 'Content-Type: application/json' \
--data '{
  "phoneNumber": "+51915024829"
}'