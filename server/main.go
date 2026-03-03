package main

import (
	"fmt"
	"os"

	"github.com/adk-saugat/socialite/server/db"
	"github.com/adk-saugat/socialite/server/routes"
	"github.com/adk-saugat/socialite/shared/utils"
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

	PORT := os.Getenv("PORT")
	if PORT == ""{
		PORT = "8080"
	}

	server.Run(fmt.Sprintf(":%v", PORT))
}
