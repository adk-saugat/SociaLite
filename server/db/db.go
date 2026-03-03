package db

import (
	"database/sql"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

func InitDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = os.Getenv("SQL_CONNECTION_STRING")
	}
	if connStr == "" {
		panic("DATABASE_URL or SQL_CONNECTION_STRING environment variable is required")
	}

	var err error
	DB, err = sql.Open("pgx", connStr)
	if err != nil {
		panic("Could not connect to database!")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	if err := DB.Ping(); err != nil {
		panic("Could not ping database!")
	}

	createTables()
}

func createTables() {
	createUserTable := `
		CREATE TABLE IF NOT EXISTS users(
			id BIGSERIAL PRIMARY KEY,
			username TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL
		)
	`

	_, err := DB.Exec(createUserTable)
	if err != nil {
		panic("Could not create users table: " + err.Error())
	}

	createPostTable := `
		CREATE TABLE IF NOT EXISTS posts(
			id BIGSERIAL PRIMARY KEY,
			content TEXT NOT NULL,
			"createdAt" TIMESTAMP NOT NULL,
			"userId" BIGINT REFERENCES users(id)
		)
	`
	_, err = DB.Exec(createPostTable)
	if err != nil {
		panic("Could not create posts table: " + err.Error())
	}

	createFollowsTable := `
		CREATE TABLE IF NOT EXISTS follows(
			id BIGSERIAL PRIMARY KEY,
			"followerId" BIGINT NOT NULL REFERENCES users(id),
			"followingId" BIGINT NOT NULL REFERENCES users(id),
			UNIQUE ("followerId", "followingId")
		)
	`
	_, err = DB.Exec(createFollowsTable)
	if err != nil {
		panic("Could not create follows table: " + err.Error())
	}
}
