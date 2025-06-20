package controllers

import (
	"net/http"
	"sibestie/config"
	"sibestie/models"
    "time"
	"github.com/gin-gonic/gin"
)

type CreateBeasiswaInput struct {
	Judul       string `json:"judul"`
	Tipe        string `json:"tipe"`
	HeaderImage string `json:"headerImage"`
	Url         string `json:"url"`
	Deskripsi   string `json:"deskripsi"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"` 
}

func GetScholarships(c *gin.Context) {
	var beasiswa []models.Beasiswa

	if err := config.DB.Find(&beasiswa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data beasiswa"})
		return
	}

	c.JSON(http.StatusOK, beasiswa)
}

func CreateScholarship(c *gin.Context) {
	var input CreateBeasiswaInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid: " + err.Error()})
		return
	}

	// Parsing string ke time.Time
	start, err := time.Parse("2006-01-02", input.StartDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format tanggal mulai tidak valid. Gunakan format YYYY-MM-DD"})
		return
	}

	end, err := time.Parse("2006-01-02", input.EndDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format tanggal berakhir tidak valid. Gunakan format YYYY-MM-DD"})
		return
	}

	// Buat objek beasiswa
	beasiswa := models.Beasiswa{
		Judul:       input.Judul,
		Tipe:        input.Tipe,
		HeaderImage: input.HeaderImage,
		Url:         input.Url,
		Deskripsi:   input.Deskripsi,
		StartDate:   start,
		EndDate:     end,
	}

	// Simpan ke database
	if err := config.DB.Create(&beasiswa).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan beasiswa"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Beasiswa berhasil ditambahkan",
		"data":    beasiswa,
	})
}