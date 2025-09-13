package models

import "github.com/adk-saugat/socialite/db"

type Follow struct{
	ID 			int64
	FollowerId 	int64
	FollowingId int64
}

func Follows(userThatFollowedId, userToFollowId int64) error{
	query :=  `
		INSERT INTO follows(followerId, followingId)
		VALUES (?, ?)
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(userThatFollowedId, userToFollowId)
	if err != nil {
		return err
	}

	return nil
}