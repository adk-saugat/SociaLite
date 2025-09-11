package controllers

import (
	"net/http"

	"github.com/adk-saugat/socialite/models"
	"github.com/adk-saugat/socialite/utils"
	"github.com/gin-gonic/gin"
)

func LoginUser(ctx *gin.Context){
	var user models.User

	err := ctx.ShouldBindJSON(&user)
	if err != nil{
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request!"})
		return
	}

	// check password
	err = user.ValidateCredentials()
	if err != nil{
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Couldnot authorize!"})
		return
	}

	// generate token
	token, err := utils.GenerateToken(user.Email, user.ID)
	if err != nil{
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot generate token!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Login successful!", "token": token})

}

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