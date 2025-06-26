package models

import "time"

type Verifikasi struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	UserID       uint   `json:"user_id"`
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
	Status         string `gorm:"default:pending" json:"status"`

	// Verifikator Feedback
	VerifikatorMessage   string     `json:"verifikator_message"`
	DataCompletenessRank int        `json:"data_completeness_rank"` // 1-10 scale
	VerifikatorID        uint       `json:"verifikator_id"`
	VerifiedAt           *time.Time `json:"verified_at"`

	CreatedAt time.Time `json:"created_at"`
}
