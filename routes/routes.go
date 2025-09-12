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

	server.GET("/post/all", controllers.FetchAllPosts)
	server.GET("/post/:id", controllers.FetchPost)

	// authenticated routes
	authenticated := server.Group("/")
	authenticated.Use(middleware.Authenticate)

	authenticated.POST("/post", controllers.CreatePost)
	authenticated.DELETE("/post/:id", controllers.DeletePost)
}