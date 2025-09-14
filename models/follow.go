package models

import (
	"errors"

	"github.com/adk-saugat/socialite/db"
)

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

func Unfollows(userThatUnfollowedId, userToUnfollowId int64) error{
	query := `DELETE FROM follows WHERE followerId = ? AND followingId = ?`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(userThatUnfollowedId, userToUnfollowId)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
   	if rowsAffected == 0 {
    	return errors.New("couldnot unfollow user that is not followed")
   	}
	return err
}