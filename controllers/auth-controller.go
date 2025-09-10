package controllers

import (
	"net/http"

	"github.com/adk-saugat/socialite/models"
	"github.com/gin-gonic/gin"
)

func RegisterUser(ctx *gin.Context){
	var user models.User

	err := ctx.ShouldBindJSON(&user)
	if err != nil || user.Username == ""{
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request!"})
		return
	}

	err = user.Register()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot register user!"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User created successfully!", "user": user})
}