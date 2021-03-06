USE [master]
GO
/****** Object:  Database [Movies]    Script Date: 29/10/2018 20:15:01 ******/
CREATE DATABASE [Movies]
GO
use [Movies]
go
CREATE TABLE [dbo].[Movies](
	[MovieId] [int] NOT NULL PRIMARY KEY identity(1,1),
	[Name] [varchar](100) NULL,
	[ReleaseDate] [smalldatetime] NULL,
	[Genre] [varchar](100) NULL
)

CREATE TABLE Users
(
	UserId int not null primary key identity(1,1),
	[Email] varchar(100) not null,
	[Password] varchar(100) not null
)

CREATE TABLE Likes(
	MovieId int not null,
	UserId int not null
	CONSTRAINT FK_likesmovies foreign key(MovieId) 
				references dbo.Movies(MovieId) ON DELETE CASCADE,
	CONSTRAINT FK_likesusers foreign key(UserId)
				references dbo.Users(UserId) ON DELETE CASCADE,
	CONSTRAINT PK_likes primary key(MovieId, UserId)
)