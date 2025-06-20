package models

import (
	"time"

	"gorm.io/gorm"
)

// ---------- USERS ----------
type User struct {
	gorm.Model
	Name        string `gorm:"type:varchar(100)"`
	Email       string `gorm:"uniqueIndex;type:varchar(100)"`
	Role        string `gorm:"type:varchar(50)"`
	Password    string
	IsVerified  bool

	// One-to-One
	Personal    Personal
	Economy     Economy
	Verification AccountVerification

	// One-to-Many
	Families    []Family
	Academics   []Academic
	Semesters   []SemesterScore
	Images      []Image
}

// ---------- PERSONAL ----------
type Personal struct {
	gorm.Model
	UserID       uint
	NIK          string `gorm:"type:varchar(20)"`
	NISN         string `gorm:"type:varchar(20)"`
	FullName     string
	BirthDate    time.Time
	BirthPlace   string
	SchoolOrigin string
	Graduated    string
	GraduationYear string

	NomorTelepon string

	KTPImageID uint
	KTPImage   Image

	KKImageID  uint
	KKImage    Image

	Instagram string `gorm:"type:text"`
	Facebook string `gorm:"type:text"`
	Tiktok string `gorm:"type:text"`
	Website string `gorm:"type:text"`
	other string `gorm:"type:text"`
}

// ---------- FAMILY ----------
type Family struct {
	gorm.Model
	UserID         uint
	FatherName     string
	FatherJob      string
	FatherEdu      string
	MotherName     string
	MotherJob      string
	MotherEdu      string
	Address        string

	Children    []Child
	KKImages    []Image `gorm:"foreignKey:FamilyID"`
}

// ---------- CHILDREN ----------
type Child struct {
	gorm.Model
	FamilyID uint
	Name     string
	Status   string // contoh: Kakak / Adik
}

// ---------- IMAGE ----------
type Image struct {
	gorm.Model
	UserID    uint
	FamilyID  *uint
	Label     string // ex: "KTP", "KK", "Ijazah"
	Data      []byte `gorm:"type:longblob"`
}

// ---------- ACADEMIC ----------
type Academic struct {
	gorm.Model
	UserID      uint
	GraduationYear string

	IjazahImageID uint
	IjazahImage   Image

	RaporImageID  uint
	RaporImage    Image
}

// ---------- SEMESTER SCORE ----------
type SemesterScore struct {
	gorm.Model
	UserID     uint
	Semester   int
	Math       float64
	Indonesian float64
	English    float64
	Science    float64
	Social     float64
}

// ---------- ECONOMY ----------
type Economy struct {
	gorm.Model
	UserID      uint
	Job         string
	Income      string
	Dependents  int
}

// ---------- ACCOUNT VERIFICATION ----------
type AccountVerification struct {
	gorm.Model
	UserID     uint
	Status     string `gorm:"type:varchar(20)"` // contoh: "pending", "verified"
	Token      string
	ExpiresAt  time.Time
}