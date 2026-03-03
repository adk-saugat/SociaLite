package models

import (
	"errors"

	"github.com/adk-saugat/socialite/server/db"
	"github.com/adk-saugat/socialite/shared/utils"
)

type User struct{
	ID			int64	
	Username 	string
	Email 		string	`binding:"required"`	
	Password 	string	`binding:"required"`
}

func (user *User) ValidateCredentials() error{
	query := `
		SELECT id, password FROM users WHERE email = $1
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
		VALUES ($1, $2, $3)
		RETURNING id
	`

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}

	err = db.DB.QueryRow(query, user.Username, user.Email, hashedPassword).Scan(&user.ID)
	if err != nil {
		return err
	}

	user.Password = hashedPassword
	return nil
}

func GetUserById(id int64) (*User, error){
	query := `SELECT id, username, email FROM users WHERE id = $1`

	row := db.DB.QueryRow(query, id)

	var user User
	err := row.Scan(&user.ID, &user.Username, &user.Email)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
