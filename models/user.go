package models

import "github.com/adk-saugat/socialite/db"

type User struct{
	ID			int64	
	Username 	string
	Email 		string	`binding:"required"`	
	Password 	string	`binding:"required"`
}

func (user *User) Register() error {
	query := `
		INSERT INTO users(username, email, password)
		VALUES (?, ?, ?)
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	result , err := stmt.Exec(user.Username, user.Email, user.Password)
	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	user.ID = userId

	return err
}