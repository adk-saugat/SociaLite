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

func GetPostByID(postId int64) (*Post, error){
	query := `SELECT * FROM posts WHERE id = ?`

	row := db.DB.QueryRow(query, postId)

	var post Post
	err := row.Scan(&post.ID, &post.Content, &post.CreatedAt, &post.UserId)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func GetAllPosts() ([]Post, error){
	query := `SELECT * FROM posts`

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err = rows.Scan(&post.ID, &post.Content, &post.CreatedAt, &post.UserId)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	return posts, nil
	
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

func (post *Post) Delete() error{
	query := `
		DELETE FROM posts WHERE id = ?
	`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(post.ID)
	return err
}