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

type FollowUser struct{
	Username string
	FollowerId int64
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

func Followers(userId int64) ([]FollowUser, error){
	query := `
		SELECT u.username, f.followerId
		FROM follows AS f
		JOIN users  AS u ON u.id = f.followerId
		WHERE f.followingId = ?
	`
	rows, err := db.DB.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []FollowUser
	for rows.Next() {
		var follower FollowUser
		if err := rows.Scan(&follower.Username, &follower.FollowerId); err != nil {
			return nil, err
		}
		followers = append(followers, follower)
	}

	return followers, nil
}

func Following(userId int64) ([]FollowUser, error){
	query := `
		SELECT u.username, f.followingId
		FROM follows AS f
		JOIN users  AS u ON u.id = f.followingId
		WHERE f.followerId = ?
	`
	rows, err := db.DB.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followings []FollowUser
	for rows.Next() {
		var following FollowUser
		if err := rows.Scan(&following.Username, &following.FollowerId); err != nil {
			return nil, err
		}
		followings = append(followings, following)
	}

	return followings, nil
}