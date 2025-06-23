package config

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	database, err := gorm.Open(sqlite.Open("database/sibestie.db"), &gorm.Config{})
	if err != nil {
		panic("Gagal koneksi ke database")
	}

	DB = database
}
