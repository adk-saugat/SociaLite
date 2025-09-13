package controllers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/socialite/models"
	"github.com/gin-gonic/gin"
)

func FollowUser(ctx *gin.Context){
	userThatFollowedId := ctx.GetInt64("userId")
	userToFollowId, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse userId!"})
		return
	}

	_, err = models.GetUserById(userToFollowId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot find user!"})
		return
	}

	err = models.Follows(userThatFollowedId, userToFollowId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot follow user!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User Followed!"})
}