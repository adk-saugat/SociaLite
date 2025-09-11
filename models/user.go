package models

import (
	"errors"

	"github.com/adk-saugat/socialite/db"
	"github.com/adk-saugat/socialite/utils"
)

type User struct{
	ID			int64	
	Username 	string
	Email 		string	`binding:"required"`	
	Password 	string	`binding:"required"`
}

func (user *User) ValidateCredentials() error{
	query := `
		SELECT id, password FROM users WHERE email = ?
	`

	row := db.DB.QueryRow(query, user.Email)

	var retrievedPassword string
	err := row.Scan(&user.ID, &retrievedPassword)
	if err != nil {
		return err
	}

	passwordIsValid := utils.CheckPasswordHash(user.Password, retrievedPassword)

	if !passwordIsValid {
		return errors.New("invalid credentials")
	}

	return nil
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

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}

	result , err := stmt.Exec(user.Username, user.Email, hashedPassword)
	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	user.ID = userId
	user.Password = hashedPassword

	return err
}