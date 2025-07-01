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

	var result []map[string]interface{}
	for _, user := range users {
		var verifikasi models.Verifikasi
		status := "Belum Ada"
		if err := config.DB.Where("user_id = ?", user.ID).First(&verifikasi).Error; err == nil {
			status = verifikasi.Status 
		}
		result = append(result, map[string]interface{}{
			"id":     user.ID,
			"name":   user.Name,
			"email":  user.Email,
			"role":   user.Role,
			"status": status,
			"created_at": user.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, result)
}

// GetVerificationUsers returns users with verification data for verifikator
func GetVerificationUsers(c *gin.Context) {
	var verifications []models.Verifikasi

	// Initialize an empty response array
	response := []map[string]interface{}{}

	// Get all verification records
	if err := config.DB.Find(&verifications).Error; err != nil {
		// Return empty array on error
		c.JSON(http.StatusOK, response)
		return
	}

	// If no records are found, return an empty array
	if len(verifications) == 0 {
		c.JSON(http.StatusOK, response)
		return
	}

	// Transform data for frontend
	for _, v := range verifications {
		// Get user email for this verification
		var user models.User
		if err := config.DB.First(&user, v.UserID).Error; err != nil {
			// Log the error but continue with other records
			continue
		}

		// Ensure status is lowercase for consistent frontend handling
		status := v.Status
		if status == "" {
			status = "pending"
		}

		response = append(response, map[string]interface{}{
			"id":           v.ID,
			"user_id":      v.UserID,
			"nama_lengkap": v.NamaLengkap,
			"email":        user.Email,
			"status":       status,
			"created_at":   v.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	// Hapus data verifikasi user
	config.DB.Where("user_id = ?", id).Delete(&models.Verifikasi{})
	// Hapus data pendaftaran beasiswa user
	config.DB.Where("user_id = ?", id).Delete(&models.Pendaftar{})
	// Hapus user
	if err := config.DB.Delete(&models.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User dan data terkait berhasil dihapus"})
}
