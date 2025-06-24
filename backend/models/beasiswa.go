package models

import (
	"time"

	"gorm.io/gorm"
)

// ---------- BEASISWA ----------
type Beasiswa struct {
	gorm.Model
	Judul       string    `gorm:"type:varchar(255)" json:"judul"`
	Tipe        string    `gorm:"type:varchar(50)" json:"tipe"`
	Author      string    `gorm:"type:text"`
	HeaderImage string    `gorm:"type:text" json:"headerImage"`
	Url         string    `gorm:"type:text" json:"url"`
	Deskripsi   string    `gorm:"type:text" json:"deskripsi"`
	StartDate   time.Time `gorm:"type:date" json:"startDate" time_format:"2006-01-02"`
	EndDate     time.Time `gorm:"type:date" json:"endDate" time_format:"2006-01-02"`

	// Relasi ke pendaftar (opsional)
	Pendaftar []Pendaftar `json:"pendaftar,omitempty"`
}

// ---------- PENDAFTAR ----------
type Pendaftar struct {
	gorm.Model
	UserID     uint
	BeasiswaID uint

	User     User     `gorm:"foreignKey:UserID"`
	Beasiswa Beasiswa `gorm:"foreignKey:BeasiswaID"`
}
