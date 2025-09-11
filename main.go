package main

import (
	"github.com/adk-saugat/socialite/db"
	"github.com/adk-saugat/socialite/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	err := godotenv.Load()
	if err != nil {
		panic("Couldnot load data!")
	}
	
	db.InitDB()
	server := gin.Default()

	routes.RegisterRoutes(server)

	server.Run(":8080")
}