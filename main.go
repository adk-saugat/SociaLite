package main

import (
	"github.com/adk-saugat/socialite/routes"
	"github.com/gin-gonic/gin"
)

func main(){
	server := gin.Default()

	routes.RegisterRoutes(server)

	server.Run(":8080")
}