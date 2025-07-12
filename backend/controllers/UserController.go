package controllers

import (
	"net/http"

	"sibestie/config"
	"sibestie/models"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []models.User
	if err := config.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data user"})
		return
	}

	c.JSON(http.StatusOK, users)
}

// GetVerificationUsers returns users with verification data for verifikator
func GetVerificationUsers(c *gin.Context) {
	var verifications []models.Verifikasi

	// Get all verification records
	if err := config.DB.Find(&verifications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data verifikasi"})
		return
	}

	// Transform data for frontend
	var response []map[string]interface{}
	for _, v := range verifications {
		// Get user email for this verification
		var user models.User
		if err := config.DB.First(&user, v.UserID).Error; err != nil {
			// Skip if user not found
			continue
		}

		response = append(response, map[string]interface{}{
			"id":           v.ID,
			"user_id":      v.UserID,
			"nama_lengkap": v.NamaLengkap,
			"email":        user.Email,
			"status":       v.Status,
			"created_at":   v.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}
