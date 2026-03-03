package models

import (
	"time"

	"github.com/adk-saugat/socialite/server/db"
)

type Post struct{
	ID 			int64		`json:"id"`
	Content 	string		`json:"content" binding:"required"`
	CreatedAt 	time.Time	`json:"createdAt"`
	UserId 		int64		`json:"userId"`
}

func GetPostByID(postId int64) (*Post, error){
	query := `SELECT id, content, "createdAt", "userId" FROM posts WHERE id = $1`

	row := db.DB.QueryRow(query, postId)

	var post Post
	err := row.Scan(&post.ID, &post.Content, &post.CreatedAt, &post.UserId)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

type PostWithAuthor struct {
	Post
	Username string `json:"username"`
}

func GetAllPosts() ([]PostWithAuthor, error) {
	query := `
		SELECT p.id, p.content, p."createdAt", p."userId", u.username
		FROM posts p
		JOIN users u ON u.id = p."userId"
		ORDER BY p."createdAt" DESC
	`
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []PostWithAuthor
	for rows.Next() {
		var p PostWithAuthor
		err = rows.Scan(&p.ID, &p.Content, &p.CreatedAt, &p.UserId, &p.Username)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (post *Post) Save() error {
	query := `
		INSERT INTO posts(content, "createdAt", "userId")
		VALUES ($1, $2, $3)
		RETURNING id
	`

	post.CreatedAt = time.Now()
	return db.DB.QueryRow(query, post.Content, post.CreatedAt, post.UserId).Scan(&post.ID)
}

func (post *Post) Delete() error{
	query := `
		DELETE FROM posts WHERE id = $1
	`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(post.ID)
	return err
}
