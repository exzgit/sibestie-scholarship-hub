package models

import (
	"time"

	"gorm.io/gorm"
)

// ---------- USERS ----------
// User is a user of the system
type User struct {
	gorm.Model
	Name     string `gorm:"type:varchar(100)"`
	Email    string `gorm:"uniqueIndex;type:varchar(100)"`
	Role     string `gorm:"type:varchar(50)"`
	Password string
}

// ---------- USER VERIFICATION ----------
// UserVerification is a verification of the user
type UserVerification struct {
	gorm.Model
	UserID   uint
	Pending  bool
	Verified bool
	Rejected bool
}

// ---------- VERIFICATION STACK ----------
// VerificationStack is a stack of verification
type VerificationStack struct {
	gorm.Model
	UserID       uint
	Verification UserVerification `gorm:"foreignKey:UserID"`
	UserData     UserData         `gorm:"foreignKey:UserID"`
}

// ---------- USER DATA ----------
// UserData is a data of the user
type UserData struct {
	gorm.Model

	// Personal Data
	UserID       uint
	NIK          string `gorm:"type:varchar(20)"`
	NISN         string `gorm:"type:varchar(20)"`
	FullName     string `gorm:"type:varchar(100)"`
	BirthDate    time.Time
	BirthPlace   string
	NomorTelepon string
	Address      string

	// Social Media
	Email         string `gorm:"type:varchar(100)"`
	SocialMediaID uint
	SocialMedia   SocialMedia `gorm:"foreignKey:SocialMediaID"`

	// Academic Data
	AcademicID uint
	Academic   Academic `gorm:"foreignKey:AcademicID"`

	// Family Data
	FamilyID uint
	Family   Family `gorm:"foreignKey:FamilyID"`

	SourceKTP []SourceFile `gorm:"foreignKey:UserDataID"`
}

// ---------- SOSIAL MEDIA ----------
type SocialMedia struct {
	gorm.Model
	UserID    uint
	Instagram string `gorm:"type:varchar(100)"`
	Facebook  string `gorm:"type:varchar(100)"`
	Tiktok    string `gorm:"type:varchar(100)"`
	Website   string `gorm:"type:varchar(100)"`
	LinkedIn  string `gorm:"type:varchar(100)"`
	Twitter   string `gorm:"type:varchar(100)"`
	Youtube   string `gorm:"type:varchar(100)"`
	Whatsapp  string `gorm:"type:varchar(100)"`
	Telegram  string `gorm:"type:varchar(100)"`
	Other     string `gorm:"type:varchar(100)"`
}

// ---------- ACADEMIC ----------
// Academic is a data of the academic
type Academic struct {
	gorm.Model
	UserID         uint
	SchoolName     string `gorm:"type:varchar(100)"`
	SchoolOrigin   string `gorm:"type:varchar(100)"`
	GraduationYear string

	RangeSemester []string `gorm:"type:varchar(100)"`

	SourceCertificate []SourceFile `gorm:"foreignKey:UserDataID"`
	SourceIjazah      []SourceFile `gorm:"foreignKey:UserDataID"`
	SourceSKL         []SourceFile `gorm:"foreignKey:UserDataID"`
}

// ---------- CHILDREN ----------
// Children is a child of the family
type Children struct {
	gorm.Model
	FamilyID uint
	FullName string
	Status   string
}

// ---------- FAMILY ----------
// Family is a family of the user
type Family struct {
	gorm.Model

	FatherName   string
	FatherJob    string
	FatherSalary int

	MotherName   string
	MotherJob    string
	MotherSalary int

	Address string

	Children []Children `gorm:"foreignKey:FamilyID"`

	SourceKKID uint
	SourceKK   SourceFile `gorm:"foreignKey:SourceKKID"`
}

// ---------- SOURCE FILE ----------
// Source File is a file that is uploaded by the user
type SourceFile struct {
	gorm.Model
	UserDataID uint   `gorm:"default:0"`
	SourceType string `gorm:"type:varchar(100)"`
	SourceName string `gorm:"type:varchar(100)"`
	SourceData []byte `gorm:"type:longblob"`
}
