package config

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/driver/sqlite"
	_ "modernc.org/sqlite"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Use modernc.org/sqlite driver directly
	database, err := gorm.Open(sqlite.Open("database/sibestie.db"), &gorm.Config{})
	if err != nil {
		fmt.Printf("Database connection error: %v\n", err)
		panic("Gagal koneksi ke database")
	}

	DB = database
	fmt.Println("Database connected successfully!")
}
