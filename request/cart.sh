curl --location 'http://localhost:3001/api/cart' \
--header 'Content-Type: application/json' \
--data '{
  "sessionId": "session-123",
  "userId": "user-123"
}'

curl --location 'http://localhost:3001/api/cart/session/session-123'

curl --location 'http://localhost:3001/api/cart/aff59e95-b6d4-4953-9d40-0d5239917847/summary'