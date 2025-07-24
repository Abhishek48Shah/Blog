#!/bin/bash
#!/bin/bash

echo "Connecting to the postgres database..."

# Execute SQL commands directly using psql -c within the container
# Use a single -c for one command, or pipe multiple commands
docker exec blog-postgres-1 psql -U postgres -d mydb -c "TRUNCATE TABLE \"User\" RESTART IDENTITY;"

# Check if the psql command was successful
if [ $? -eq 0 ]; then
    echo "Postgres table 'User' truncated successfully."
else
    echo "Error truncating Postgres table 'User'."
    exit 1
fi

echo "Connecting to Redis..."

# Execute Redis commands directly using redis-cli within the container
docker exec blog-redis-1 redis-cli FLUSHALL

# Check if the redis-cli command was successful
if [ $? -eq 0 ]; then
    echo "Redis flushed successfully."
else
    echo "Error flushing Redis."
    exit 1
fi

echo "Performing curl requests..."

# First curl request: signup
# Ensure the -d argument is properly quoted, especially with JSON
curl -X POST "http://localhost:3000/signup/basic" \
     -H 'Content-Type: application/json' \
     -d '{"username":"Ram","email":"ram123@gmail.com","password":"ram123ram"}' \
     -c cookie.txt

# Check curl exit status for signup
if [ $? -eq 0 ]; then
    echo "Signup curl request successful."
else
    echo "Error with signup curl request."
    exit 1
fi

# Second curl request: refresh token, using the cookie from the previous request
curl -X POST "http://localhost:3000/refresh/token" -b cookie.txt

# Check curl exit status for refresh token
if [ $? -eq 0 ]; then
    echo "Refresh token curl request successful."
else
    echo "Error with refresh token curl request."
    exit 1
fi

echo "Script finished successfully."
