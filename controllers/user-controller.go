package controllers

import (
	"net/http"

	"github.com/adk-saugat/socialite/models"
	"github.com/gin-gonic/gin"
)

func GetUserProfile(ctx *gin.Context){
	userId := ctx.GetInt64("userId")

	user, err := models.GetUserById(userId)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Couldnot find user!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": gin.H{
		"id": user.ID,
		"username": user.Username,
		"email": user.Email,
	}})
}