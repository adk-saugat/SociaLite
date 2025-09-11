package routes

import (
	"net/http"

	"github.com/adk-saugat/socialite/controllers"
	"github.com/adk-saugat/socialite/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine){
	server.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "Server Running!"})
	})

	server.POST("/auth/register", controllers.RegisterUser)
	server.POST("/auth/login", controllers.LoginUser)

	authenticated := server.Group("/")
	authenticated.Use(middleware.Authenticate)

	authenticated.POST("/post", controllers.CreatePost)
}