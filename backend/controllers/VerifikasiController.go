package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
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
	DataCompletenessRank int    `json:"data_completeness_rank"`
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
	fieldWeight := 1.0 / float64(len(personalFields))
	return float64(filledCount) * fieldWeight
}

// calculateAcademicDataScore calculates score for academic data (40% weight)
func calculateAcademicDataScore(data VerifikasiData) float64 {
	// 5 field: asal_sekolah, tahun_lulus, nilai_semester_1, nilai_semester_2, foto_ijazah
	fieldCount := 5.0
	fieldWeight := 1.0 / fieldCount
	filled := 0.0

	if data.AsalSekolah != "" {
		filled += fieldWeight
	}
	if data.TahunLulus != "" {
		filled += fieldWeight
	}
	// Nilai semester 1
	if data.NilaiSemester1 != "" {
		if nilai, err := strconv.ParseFloat(data.NilaiSemester1, 64); err == nil {
			if nilai >= 8.0 {
				filled += fieldWeight
			} else if nilai >= 6.0 {
				filled += fieldWeight * 0.5
			}
		}
	}
	// Nilai semester 2
	if data.NilaiSemester2 != "" {
		if nilai, err := strconv.ParseFloat(data.NilaiSemester2, 64); err == nil {
			if nilai >= 8.0 {
				filled += fieldWeight
			} else if nilai >= 6.0 {
				filled += fieldWeight * 0.5
			}
		}
	}
	if data.FotoIjazah != "" {
		filled += fieldWeight
	}
	return filled
}

// calculateFamilyDataScore calculates score for family economic data (50% weight)
func calculateFamilyDataScore(data VerifikasiData) float64 {
	// 5 field: pekerjaan_ibu, pendapatan_ibu, pekerjaan_ayah, pendapatan_ayah, alamat_keluarga
	fieldCount := 5.0
	fieldWeight := 1.0 / fieldCount
	filled := 0.0

	if data.PekerjaanIbu != "" {
		filled += fieldWeight
	}
	// Pendapatan Ibu
	if data.PendapatanIbu > 0 {
		income := float64(data.PendapatanIbu)
		if income < 1000000 {
			filled += fieldWeight
		} else if income >= 1000000 && income <= 2000000 {
			filled += fieldWeight * 0.6
		} else if income > 2000000 && income <= 5000000 {
			filled += fieldWeight * 0.3
		}
		// >5jt tidak dapat skor
	}
	if data.PekerjaanAyah != "" {
		filled += fieldWeight
	}
	// Pendapatan Ayah
	if data.PendapatanAyah > 0 {
		income := float64(data.PendapatanAyah)
		if income < 1000000 {
			filled += fieldWeight
		} else if income >= 1000000 && income <= 2000000 {
			filled += fieldWeight * 0.6
		} else if income > 2000000 && income <= 5000000 {
			filled += fieldWeight * 0.3
		}
	}
	if data.AlamatKeluarga != "" {
		filled += fieldWeight
	}
	return filled
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

	// Hitung ulang skor pembobotan untuk detail breakdown
	personalScore := calculatePersonalDataScore(data) * 100.0
	academicScore := calculateAcademicDataScore(data) * 100.0
	familyScore := calculateFamilyDataScore(data) * 100.0

	c.JSON(http.StatusOK, gin.H{
		"id": data.ID,
		"user_id": data.UserID,
		"nik": data.NIK,
		"nisn": data.NISN,
		"nama_lengkap": data.NamaLengkap,
		"tanggal_lahir": data.TanggalLahir,
		"tempat_lahir": data.TempatLahir,
		"alamat": data.Alamat,
		"foto_ktp": data.FotoKTP,
		"nomor_telepon": data.NomorTelepon,
		"email": data.Email,
		"instagram": data.Instagram,
		"facebook": data.Facebook,
		"tiktok": data.Tiktok,
		"website": data.Website,
		"linkedin": data.LinkedIn,
		"twitter": data.Twitter,
		"youtube": data.Youtube,
		"whatsapp": data.Whatsapp,
		"telegram": data.Telegram,
		"other": data.Other,
		"nama_ibu": data.NamaIbu,
		"pekerjaan_ibu": data.PekerjaanIbu,
		"pendapatan_ibu": data.PendapatanIbu,
		"nama_ayah": data.NamaAyah,
		"pekerjaan_ayah": data.PekerjaanAyah,
		"pendapatan_ayah": data.PendapatanAyah,
		"alamat_keluarga": data.AlamatKeluarga,
		"foto_kk": data.FotoKK,
		"saudara": data.Saudara,
		"asal_sekolah": data.AsalSekolah,
		"tahun_lulus": data.TahunLulus,
		"nilai_semester_1": data.NilaiSemester1,
		"nilai_semester_2": data.NilaiSemester2,
		"foto_ijazah": data.FotoIjazah,
		"foto_skl": data.FotoSKL,
		"foto_sertifikat": data.FotoSertifikat,
		"status": data.Status,
		"verifikator_message": data.VerifikatorMessage,
		"data_completeness_rank": data.DataCompletenessRank,
		"verifikator_id": data.VerifikatorID,
		"verified_at": data.VerifiedAt,
		"created_at": data.CreatedAt,
		"updated_at": data.UpdatedAt,
		// Tambahan breakdown pembobotan
		"personal_score": personalScore,
		"academic_score": academicScore,
		"family_score": familyScore,
	})
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

// GetMonthlyRegistrationStats retrieves monthly statistics about user registrations
func GetMonthlyRegistrationStats(c *gin.Context) {
	// Calculate the start date (beginning of current year)
	currentYear := time.Now().Year()
	startDate := time.Date(currentYear, 1, 1, 0, 0, 0, 0, time.Local)
	
	// Query to get monthly registration counts
	var results []struct {
		Month string `json:"month"`
		Count int    `json:"count"`
	}
	
	// SQL query that groups registrations by month
	query := `
		SELECT 
			strftime('%m', created_at) as month,
			COUNT(*) as count
		FROM verifikasis
		WHERE created_at >= ?
		GROUP BY month
		ORDER BY month
	`
	
	if err := config.DB.Raw(query, startDate).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get monthly registration stats"})
		return
	}
	
	// Create a map for all months (1-12) with zero counts
	monthlyStats := make(map[string]int)
	for i := 1; i <= 12; i++ {
		month := fmt.Sprintf("%02d", i)
		monthlyStats[month] = 0
	}
	
	// Fill in actual counts from results
	for _, result := range results {
		monthlyStats[result.Month] = result.Count
	}
	
	// Create the final response array in month order
	var response []map[string]interface{}
	for i := 1; i <= 12; i++ {
		month := fmt.Sprintf("%02d", i)
		monthName := time.Month(i).String()
		response = append(response, map[string]interface{}{
			"month":      month,
			"month_name": monthName,
			"count":      monthlyStats[month],
		})
	}
	
	c.JSON(http.StatusOK, response)
}