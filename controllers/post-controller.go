package controllers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/socialite/models"
	"github.com/gin-gonic/gin"
)

func FetchPost(ctx *gin.Context){
	postId, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Couldnot parse postId!"})
		return
	}

	post, err := models.GetPostByID(postId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Couldnot fetch post!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"post": post})
}

func FetchAllPosts(ctx *gin.Context){
	posts, err := models.GetAllPosts()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot fetch all posts!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"posts": posts})
}


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