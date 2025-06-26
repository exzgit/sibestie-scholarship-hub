package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"sibestie/config"
	"sibestie/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Test endpoint for connection testing
func TestConnection(c *gin.Context) {
	var data map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Just return success to test connection
	c.JSON(http.StatusOK, gin.H{"message": "Connection successful", "received_data": data})
}

// VerifikasiData represents the verification data structure
type VerifikasiData struct {
	ID           int    `json:"id"`
	UserID       int    `json:"user_id"`
	NIK          string `json:"nik"`
	NISN         string `json:"nisn"`
	NamaLengkap  string `json:"nama_lengkap"`
	TanggalLahir string `json:"tanggal_lahir"`
	TempatLahir  string `json:"tempat_lahir"`
	Alamat       string `json:"alamat"`
	FotoKTP      string `json:"foto_ktp"`

	// Contact Information
	NomorTelepon string `json:"nomor_telepon"`
	Email        string `json:"email"`

	// Social Media
	Instagram string `json:"instagram"`
	Facebook  string `json:"facebook"`
	Tiktok    string `json:"tiktok"`
	Website   string `json:"website"`
	LinkedIn  string `json:"linkedin"`
	Twitter   string `json:"twitter"`
	Youtube   string `json:"youtube"`
	Whatsapp  string `json:"whatsapp"`
	Telegram  string `json:"telegram"`
	Other     string `json:"other"`

	NamaIbu        string `json:"nama_ibu"`
	PekerjaanIbu   string `json:"pekerjaan_ibu"`
	PendapatanIbu  int    `json:"pendapatan_ibu"`
	NamaAyah       string `json:"nama_ayah"`
	PekerjaanAyah  string `json:"pekerjaan_ayah"`
	PendapatanAyah int    `json:"pendapatan_ayah"`
	AlamatKeluarga string `json:"alamat_keluarga"`
	FotoKK         string `json:"foto_kk"`
	Saudara        string `json:"saudara"`
	AsalSekolah    string `json:"asal_sekolah"`
	TahunLulus     string `json:"tahun_lulus"`
	NilaiSemester1 string `json:"nilai_semester_1"`
	NilaiSemester2 string `json:"nilai_semester_2"`
	FotoIjazah     string `json:"foto_ijazah"`
	FotoSKL        string `json:"foto_skl"`
	FotoSertifikat string `json:"foto_sertifikat"`
	Status         string `json:"status"`

	// Verifikator Feedback
	VerifikatorMessage   string  `json:"verifikator_message"`
	DataCompletenessRank int     `json:"data_completeness_rank"`
	VerifikatorID        int     `json:"verifikator_id"`
	VerifiedAt           *string `json:"verified_at"`

	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// VerificationStatus represents the verification status response
type VerificationStatus struct {
	Status string `json:"status"`
	UserID int    `json:"user_id"`
}

// VerificationStats represents verification statistics
type VerificationStats struct {
	TotalUsers    int `json:"total_users"`
	VerifiedUsers int `json:"verified_users"`
	PendingUsers  int `json:"pending_users"`
	RejectedUsers int `json:"rejected_users"`
}

// VerificationFeedbackRequest represents the feedback data from verifikator
type VerificationFeedbackRequest struct {
	Message              string `json:"message" binding:"required"`
	DataCompletenessRank int    `json:"data_completeness_rank" binding:"required,min=1,max=10"`
}

// CalculateDataCompletenessRank calculates the completeness rank based on weighted criteria
func CalculateDataCompletenessRank(data VerifikasiData) int {
	totalScore := 0.0

	// 1. Data Personal (10%)
	personalScore := calculatePersonalDataScore(data)
	totalScore += personalScore * 0.10

	// 2. Data Akademik (40%)
	academicScore := calculateAcademicDataScore(data)
	totalScore += academicScore * 0.40

	// 3. Data Ekonomi Keluarga (50%)
	familyScore := calculateFamilyDataScore(data)
	totalScore += familyScore * 0.50

	// Convert to 1-10 scale
	rank := int(totalScore * 10)
	if rank < 1 {
		rank = 1
	} else if rank > 10 {
		rank = 10
	}

	return rank
}

// calculatePersonalDataScore calculates score for personal data (10% weight)
func calculatePersonalDataScore(data VerifikasiData) float64 {
	personalFields := []bool{
		data.NIK != "",
		data.NISN != "",
		data.NamaLengkap != "",
		data.TanggalLahir != "",
		data.TempatLahir != "",
		data.Alamat != "",
		data.FotoKTP != "",
		data.NomorTelepon != "",
		data.Email != "",
	}

	filledCount := 0
	for _, filled := range personalFields {
		if filled {
			filledCount++
		}
	}

	// Each field gets equal weight (100% / number of fields)
	fieldWeight := 100.0 / float64(len(personalFields))
	return float64(filledCount) * fieldWeight / 100.0
}

// calculateAcademicDataScore calculates score for academic data (40% weight)
func calculateAcademicDataScore(data VerifikasiData) float64 {
	academicFields := []struct {
		value  string
		weight float64
	}{
		{data.AsalSekolah, 20.0},    // 20% of academic score
		{data.TahunLulus, 20.0},     // 20% of academic score
		{data.NilaiSemester1, 30.0}, // 30% of academic score
		{data.NilaiSemester2, 30.0}, // 30% of academic score
	}

	totalScore := 0.0
	for _, field := range academicFields {
		if field.value != "" {
			// For non-numeric fields, give full score
			if field.value == data.AsalSekolah || field.value == data.TahunLulus {
				totalScore += field.weight
			} else {
				// For numeric fields (nilai), apply scoring based on value
				if nilai, err := strconv.ParseFloat(field.value, 64); err == nil {
					if nilai >= 8.0 {
						totalScore += field.weight // Full score for 8-10
					} else if nilai >= 6.0 {
						totalScore += field.weight * 0.5 // 50% score for 6-8
					}
					// 0% score for < 6.0
				}
			}
		}
	}

	return totalScore / 100.0
}

// calculateFamilyDataScore calculates score for family economic data (50% weight)
func calculateFamilyDataScore(data VerifikasiData) float64 {
	familyFields := []struct {
		income int
		weight float64
	}{
		{data.PendapatanIbu, 25.0},  // 25% of family score
		{data.PendapatanAyah, 25.0}, // 25% of family score
	}

	totalScore := 0.0
	for _, field := range familyFields {
		incomeInMillions := float64(field.income) / 1000000.0

		if incomeInMillions < 1.0 {
			totalScore += field.weight // Full score for < 1jt
		} else if incomeInMillions <= 2.0 {
			totalScore += field.weight * 0.6 // 60% score for 1-2jt
		} else if incomeInMillions <= 5.0 {
			totalScore += field.weight * 0.3 // 30% score for 3-5jt
		}
		// 0% score for > 5jt
	}

	return totalScore / 100.0
}

// POST /api/verifikasi
func SubmitVerifikasi(c *gin.Context) {
	var data VerifikasiData
	if err := c.ShouldBindJSON(&data); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data: " + err.Error()})
		return
	}

	// Check if user already has a verification record
	var existingVerifikasi models.Verifikasi
	result := config.DB.Where("user_id = ?", data.UserID).First(&existingVerifikasi)
	if result.Error == nil {
		// User already has a verification record
		c.JSON(http.StatusConflict, gin.H{"error": "User already has a verification record"})
		return
	} else if result.Error.Error() != "record not found" {
		// Database error
		log.Printf("Error checking existing verification: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing verification"})
		return
	}

	// Marshal saudara data to ensure it's valid JSON
	saudaraJSON := data.Saudara
	var saudaraObj interface{}
	if err := json.Unmarshal([]byte(data.Saudara), &saudaraObj); err != nil {
		// If not valid JSON, attempt to fix it
		saudaraJSON = "[]"
	}

	// Create new verification record using GORM
	verifikasi := models.Verifikasi{
		UserID:         uint(data.UserID),
		NIK:            data.NIK,
		NISN:           data.NISN,
		NamaLengkap:    data.NamaLengkap,
		TanggalLahir:   data.TanggalLahir,
		TempatLahir:    data.TempatLahir,
		Alamat:         data.Alamat,
		FotoKTP:        data.FotoKTP,
		NomorTelepon:   data.NomorTelepon,
		Email:          data.Email,
		Instagram:      data.Instagram,
		Facebook:       data.Facebook,
		Tiktok:         data.Tiktok,
		Website:        data.Website,
		LinkedIn:       data.LinkedIn,
		Twitter:        data.Twitter,
		Youtube:        data.Youtube,
		Whatsapp:       data.Whatsapp,
		Telegram:       data.Telegram,
		Other:          data.Other,
		NamaIbu:        data.NamaIbu,
		PekerjaanIbu:   data.PekerjaanIbu,
		PendapatanIbu:  data.PendapatanIbu,
		NamaAyah:       data.NamaAyah,
		PekerjaanAyah:  data.PekerjaanAyah,
		PendapatanAyah: data.PendapatanAyah,
		AlamatKeluarga: data.AlamatKeluarga,
		FotoKK:         data.FotoKK,
		Saudara:        saudaraJSON,
		AsalSekolah:    data.AsalSekolah,
		TahunLulus:     data.TahunLulus,
		NilaiSemester1: data.NilaiSemester1,
		NilaiSemester2: data.NilaiSemester2,
		FotoIjazah:     data.FotoIjazah,
		FotoSKL:        data.FotoSKL,
		FotoSertifikat: data.FotoSertifikat,
		Status:         "pending",
	}

	// Calculate automatic data completeness rank
	verifikasiData := VerifikasiData{
		UserID:         data.UserID,
		NIK:            data.NIK,
		NISN:           data.NISN,
		NamaLengkap:    data.NamaLengkap,
		TanggalLahir:   data.TanggalLahir,
		TempatLahir:    data.TempatLahir,
		Alamat:         data.Alamat,
		FotoKTP:        data.FotoKTP,
		NomorTelepon:   data.NomorTelepon,
		Email:          data.Email,
		Instagram:      data.Instagram,
		Facebook:       data.Facebook,
		Tiktok:         data.Tiktok,
		Website:        data.Website,
		LinkedIn:       data.LinkedIn,
		Twitter:        data.Twitter,
		Youtube:        data.Youtube,
		Whatsapp:       data.Whatsapp,
		Telegram:       data.Telegram,
		Other:          data.Other,
		NamaIbu:        data.NamaIbu,
		PekerjaanIbu:   data.PekerjaanIbu,
		PendapatanIbu:  data.PendapatanIbu,
		NamaAyah:       data.NamaAyah,
		PekerjaanAyah:  data.PekerjaanAyah,
		PendapatanAyah: data.PendapatanAyah,
		AlamatKeluarga: data.AlamatKeluarga,
		FotoKK:         data.FotoKK,
		Saudara:        data.Saudara,
		AsalSekolah:    data.AsalSekolah,
		TahunLulus:     data.TahunLulus,
		NilaiSemester1: data.NilaiSemester1,
		NilaiSemester2: data.NilaiSemester2,
		FotoIjazah:     data.FotoIjazah,
		FotoSKL:        data.FotoSKL,
		FotoSertifikat: data.FotoSertifikat,
		Status:         "pending",
	}

	verifikasi.DataCompletenessRank = CalculateDataCompletenessRank(verifikasiData)

	// Insert the verification data
	if err := config.DB.Create(&verifikasi).Error; err != nil {
		log.Printf("Error inserting verification data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save verification data: " + err.Error()})
		return
	}

	log.Printf("Verification data saved successfully for user ID: %d", data.UserID)
	c.JSON(http.StatusOK, gin.H{"message": "Verification data submitted successfully", "id": verifikasi.ID})
}

// GET /api/verifikasi/pending
func ListPendingVerifikasi(c *gin.Context) {
	var pendingVerifications []models.Verifikasi

	result := config.DB.Where("status = ?", "pending").Find(&pendingVerifications)
	if result.Error != nil {
		log.Printf("Error querying pending verifications: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query pending verifications"})
		return
	}

	var response []map[string]interface{}
	for _, v := range pendingVerifications {
		response = append(response, map[string]interface{}{
			"id":           v.ID,
			"user_id":      v.UserID,
			"nik":          v.NIK,
			"nama_lengkap": v.NamaLengkap,
			"created_at":   v.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GET /api/verifikasi/:id
func GetVerifikasiDetail(c *gin.Context) {
	verifikasiID := c.Param("id")
	if verifikasiID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Verification ID is required"})
		return
	}

	var verifikasi models.Verifikasi
	result := config.DB.First(&verifikasi, verifikasiID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Verification data not found"})
		} else {
			log.Printf("Error getting verification details: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get verification details"})
		}
		return
	}

	// Convert to response format
	data := VerifikasiData{
		ID:                   int(verifikasi.ID),
		UserID:               int(verifikasi.UserID),
		NIK:                  verifikasi.NIK,
		NISN:                 verifikasi.NISN,
		NamaLengkap:          verifikasi.NamaLengkap,
		TanggalLahir:         verifikasi.TanggalLahir,
		TempatLahir:          verifikasi.TempatLahir,
		Alamat:               verifikasi.Alamat,
		FotoKTP:              verifikasi.FotoKTP,
		NomorTelepon:         verifikasi.NomorTelepon,
		Email:                verifikasi.Email,
		Instagram:            verifikasi.Instagram,
		Facebook:             verifikasi.Facebook,
		Tiktok:               verifikasi.Tiktok,
		Website:              verifikasi.Website,
		LinkedIn:             verifikasi.LinkedIn,
		Twitter:              verifikasi.Twitter,
		Youtube:              verifikasi.Youtube,
		Whatsapp:             verifikasi.Whatsapp,
		Telegram:             verifikasi.Telegram,
		Other:                verifikasi.Other,
		NamaIbu:              verifikasi.NamaIbu,
		PekerjaanIbu:         verifikasi.PekerjaanIbu,
		PendapatanIbu:        verifikasi.PendapatanIbu,
		NamaAyah:             verifikasi.NamaAyah,
		PekerjaanAyah:        verifikasi.PekerjaanAyah,
		PendapatanAyah:       verifikasi.PendapatanAyah,
		AlamatKeluarga:       verifikasi.AlamatKeluarga,
		FotoKK:               verifikasi.FotoKK,
		Saudara:              verifikasi.Saudara,
		AsalSekolah:          verifikasi.AsalSekolah,
		TahunLulus:           verifikasi.TahunLulus,
		NilaiSemester1:       verifikasi.NilaiSemester1,
		NilaiSemester2:       verifikasi.NilaiSemester2,
		FotoIjazah:           verifikasi.FotoIjazah,
		FotoSKL:              verifikasi.FotoSKL,
		FotoSertifikat:       verifikasi.FotoSertifikat,
		Status:               verifikasi.Status,
		VerifikatorMessage:   verifikasi.VerifikatorMessage,
		DataCompletenessRank: verifikasi.DataCompletenessRank,
		VerifikatorID:        int(verifikasi.VerifikatorID),
		CreatedAt:            verifikasi.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	// Handle VerifiedAt field
	if verifikasi.VerifiedAt != nil {
		verifiedAtStr := verifikasi.VerifiedAt.Format("2006-01-02 15:04:05")
		data.VerifiedAt = &verifiedAtStr
	}

	c.JSON(http.StatusOK, data)
}

// POST /api/verifikasi/:id/approve
func ApproveVerifikasi(c *gin.Context) {
	verifikasiID := c.Param("id")
	if verifikasiID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Verification ID is required"})
		return
	}

	// Parse feedback request
	var feedback VerificationFeedbackRequest
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feedback data: " + err.Error()})
		return
	}

	// Get verifikator ID from token (assuming it's stored in context)
	// For now, we'll use a default value or extract from token
	verifikatorID := uint(1) // TODO: Extract from JWT token

	var verifikasi models.Verifikasi
	result := config.DB.First(&verifikasi, verifikasiID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Verification data not found"})
		} else {
			log.Printf("Error finding verification for approval: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find verification data"})
		}
		return
	}

	// Use automatic ranking if not provided or use provided ranking
	ranking := feedback.DataCompletenessRank
	if ranking == 0 {
		// Convert verifikasi model to VerifikasiData for calculation
		verifikasiData := VerifikasiData{
			UserID:         int(verifikasi.UserID),
			NIK:            verifikasi.NIK,
			NISN:           verifikasi.NISN,
			NamaLengkap:    verifikasi.NamaLengkap,
			TanggalLahir:   verifikasi.TanggalLahir,
			TempatLahir:    verifikasi.TempatLahir,
			Alamat:         verifikasi.Alamat,
			FotoKTP:        verifikasi.FotoKTP,
			NomorTelepon:   verifikasi.NomorTelepon,
			Email:          verifikasi.Email,
			Instagram:      verifikasi.Instagram,
			Facebook:       verifikasi.Facebook,
			Tiktok:         verifikasi.Tiktok,
			Website:        verifikasi.Website,
			LinkedIn:       verifikasi.LinkedIn,
			Twitter:        verifikasi.Twitter,
			Youtube:        verifikasi.Youtube,
			Whatsapp:       verifikasi.Whatsapp,
			Telegram:       verifikasi.Telegram,
			Other:          verifikasi.Other,
			NamaIbu:        verifikasi.NamaIbu,
			PekerjaanIbu:   verifikasi.PekerjaanIbu,
			PendapatanIbu:  verifikasi.PendapatanIbu,
			NamaAyah:       verifikasi.NamaAyah,
			PekerjaanAyah:  verifikasi.PekerjaanAyah,
			PendapatanAyah: verifikasi.PendapatanAyah,
			AlamatKeluarga: verifikasi.AlamatKeluarga,
			FotoKK:         verifikasi.FotoKK,
			Saudara:        verifikasi.Saudara,
			AsalSekolah:    verifikasi.AsalSekolah,
			TahunLulus:     verifikasi.TahunLulus,
			NilaiSemester1: verifikasi.NilaiSemester1,
			NilaiSemester2: verifikasi.NilaiSemester2,
			FotoIjazah:     verifikasi.FotoIjazah,
			FotoSKL:        verifikasi.FotoSKL,
			FotoSertifikat: verifikasi.FotoSertifikat,
			Status:         verifikasi.Status,
		}
		ranking = CalculateDataCompletenessRank(verifikasiData)
	}

	// Update verification status and feedback
	now := time.Now()
	verifikasi.Status = "approved"
	verifikasi.VerifikatorMessage = feedback.Message
	verifikasi.DataCompletenessRank = ranking
	verifikasi.VerifikatorID = verifikatorID
	verifikasi.VerifiedAt = &now

	if err := config.DB.Save(&verifikasi).Error; err != nil {
		log.Printf("Error approving verification: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve verification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification approved successfully",
		"feedback": gin.H{
			"message":                feedback.Message,
			"data_completeness_rank": ranking,
		},
	})
}

// POST /api/verifikasi/:id/reject
func RejectVerifikasi(c *gin.Context) {
	verifikasiID := c.Param("id")
	if verifikasiID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Verification ID is required"})
		return
	}

	// Parse feedback request
	var feedback VerificationFeedbackRequest
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feedback data: " + err.Error()})
		return
	}

	// Get verifikator ID from token (assuming it's stored in context)
	// For now, we'll use a default value or extract from token
	verifikatorID := uint(1) // TODO: Extract from JWT token

	var verifikasi models.Verifikasi
	result := config.DB.First(&verifikasi, verifikasiID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Verification data not found"})
		} else {
			log.Printf("Error finding verification for rejection: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find verification data"})
		}
		return
	}

	// Update verification status and feedback
	now := time.Now()
	verifikasi.Status = "rejected"
	verifikasi.VerifikatorMessage = feedback.Message
	verifikasi.DataCompletenessRank = feedback.DataCompletenessRank
	verifikasi.VerifikatorID = verifikatorID
	verifikasi.VerifiedAt = &now

	if err := config.DB.Save(&verifikasi).Error; err != nil {
		log.Printf("Error rejecting verification: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject verification"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification rejected successfully",
		"feedback": gin.H{
			"message":                feedback.Message,
			"data_completeness_rank": feedback.DataCompletenessRank,
		},
	})
}

// GET /api/verifikasi/status/:user_id
func GetVerificationStatus(c *gin.Context) {
	userID := c.Param("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var verifikasi models.Verifikasi
	result := config.DB.Where("user_id = ?", userID).First(&verifikasi)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// No verification record found - this is normal, no error logging
			c.JSON(http.StatusOK, gin.H{"status": nil, "user_id": userID})
		} else {
			// Only log actual errors, not "record not found"
			log.Printf("Error getting verification status: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get verification status"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": verifikasi.Status, "user_id": userID})
}

// GetVerificationStats retrieves statistics about verification data
func GetVerificationStats(c *gin.Context) {
	var stats VerificationStats

	// Get total users count
	var totalCount int64
	if err := config.DB.Model(&models.Verifikasi{}).Count(&totalCount).Error; err != nil {
		log.Printf("Error getting total users count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get total users count"})
		return
	}
	stats.TotalUsers = int(totalCount)

	// Get verified users count
	var verifiedCount int64
	if err := config.DB.Model(&models.Verifikasi{}).Where("status = ?", "approved").Count(&verifiedCount).Error; err != nil {
		log.Printf("Error getting verified users count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get verified users count"})
		return
	}
	stats.VerifiedUsers = int(verifiedCount)

	// Get pending users count
	var pendingCount int64
	if err := config.DB.Model(&models.Verifikasi{}).Where("status = ?", "pending").Count(&pendingCount).Error; err != nil {
		log.Printf("Error getting pending users count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pending users count"})
		return
	}
	stats.PendingUsers = int(pendingCount)

	// Get rejected users count
	var rejectedCount int64
	if err := config.DB.Model(&models.Verifikasi{}).Where("status = ?", "rejected").Count(&rejectedCount).Error; err != nil {
		log.Printf("Error getting rejected users count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get rejected users count"})
		return
	}
	stats.RejectedUsers = int(rejectedCount)

	c.JSON(http.StatusOK, stats)
}
