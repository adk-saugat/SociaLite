package main

import (
	"github.com/adk-saugat/socialite/db"
	"github.com/adk-saugat/socialite/routes"
	"github.com/adk-saugat/socialite/utils"
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
	
	utils.SetCors(server)
	routes.RegisterRoutes(server)

	server.Run(":8080")
}