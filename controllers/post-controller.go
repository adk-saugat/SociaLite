package controllers

import (
	"net/http"

	"github.com/adk-saugat/socialite/models"
	"github.com/gin-gonic/gin"
)


func CreatePost(ctx *gin.Context){
	var post models.Post

	err := ctx.ShouldBindJSON(&post)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request!"})
		return
	}

	userId := ctx.GetInt64("userId")
	post.UserId = userId

	err = post.Save()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot create post! Try again later."})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Post created successfully!", "post": post})
}