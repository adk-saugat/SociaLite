package middleware

import (
	"net/http"

	"github.com/adk-saugat/socialite/utils"
	"github.com/gin-gonic/gin"
)

func Authenticate(ctx *gin.Context){
	token := ctx.Request.Header.Get("Authorization")
	if token == ""{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Couldnot authorize!"})
		return
	}

	userId, err := utils.VerifyToken(token)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized,  gin.H{"error": "Couldnot authorize!"})
		return
	}

	ctx.Set("userId", userId)
	ctx.Next()
}