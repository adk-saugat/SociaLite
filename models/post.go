package models

import (
	"time"

	"github.com/adk-saugat/socialite/db"
)

type Post struct{
	ID 			int64		`json:"id"`
	Content 	string		`json:"content" binding:"required"`
	CreatedAt 	time.Time	`json:"createdAt"`
	UserId 		int64		`json:"userId"`
}

func (post *Post) Save() error{
	query := `
		INSERT INTO posts(content, createdAt, userId)
		VALUES (?, ?, ?)
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	post.CreatedAt = time.Now()
	result, err := stmt.Exec(post.Content, post.CreatedAt, post.UserId)
	if err != nil {
		return err
	}

	postID, err := result.LastInsertId()
	if err != nil {
		return err
	}
	post.ID = postID

	return nil
}