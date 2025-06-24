package main

import (
	"fmt"
	"log"
	"os"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"sibestie/config"
	"sibestie/controllers"
	"sibestie/models"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	fmt.Println("[SERVER] Running")

	ip := os.Getenv("IP_ADDRESS")
	port := os.Getenv("BACKEND_PORT")
	fport := os.Getenv("FRONTEND_PORT")

	if ip == "" || port == "" {
		log.Fatal("IP_ADDRESS atau BACKEND_PORT belum diset di .env")
	}

	config.ConnectDatabase()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Beasiswa{},
		&models.UserData{},
		&models.Family{},
		&models.Children{},
		&models.SourceFile{},
		&models.UserVerification{},
		&models.VerificationStack{},
		&models.Pendaftar{},
	)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{fmt.Sprintf("http://localhost:%s", fport), fmt.Sprintf("http://%s:%s", ip, fport)},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	setupRoutes(r)

	// r.GET("/", func(c *gin.Context) {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"message": "Welcome to Sibestie Backend 🚀",
	// 	})
	// })

	if err := r.Run(os.Getenv("IP_ADDRESS") + ":" + os.Getenv("BACKEND_PORT")); err != nil {
		log.Fatal("Server error:", err)
	}
}

func setupRoutes(r *gin.Engine) {
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(204)
	})

	authGroup := r.Group("/")
	{
		authGroup.POST("/register", controllers.RegisterHandler)
		authGroup.POST("/login", controllers.LoginHandler)
	}

	r.GET("/api/scholarships", controllers.GetScholarships)
	r.POST("/api/scholarships", controllers.CreateScholarship)
}
