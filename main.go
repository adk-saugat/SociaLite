package main

import (
	"github.com/adk-saugat/socialite/db"
	"github.com/adk-saugat/socialite/routes"
	"github.com/gin-gonic/gin"
)

func main(){
	db.InitDB()
	server := gin.Default()

	routes.RegisterRoutes(server)

	server.Run(":8080")
}