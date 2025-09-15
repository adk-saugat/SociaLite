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

	// authentication routes
	server.POST("/auth/register", controllers.RegisterUser)
	server.POST("/auth/login", controllers.LoginUser)

	// unauthenticated routes
	server.GET("/post/all", controllers.FetchAllPosts)
	server.GET("/post/:id", controllers.FetchPost)

	// authenticated routes
	authenticated := server.Group("/")
	authenticated.Use(middleware.Authenticate)

	// user routes
	authenticated.GET("/user/me", controllers.GetUserProfile)
	authenticated.GET("/user/follower", controllers.GetUserFollowers)
	authenticated.GET("/user/following", controllers.GetUserFollowing)

	//post routes
	authenticated.POST("/post", controllers.CreatePost)
	authenticated.DELETE("/post/:id", controllers.DeletePost)

	// follow routes
	authenticated.POST("/follow/:id", controllers.FollowUser)
	authenticated.DELETE("/unfollow/:id", controllers.UnfollowUser)
}