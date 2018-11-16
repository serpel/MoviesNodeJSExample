USE [master]
GO
/****** Object:  Database [Movies]    Script Date: 29/10/2018 20:15:01 ******/
CREATE DATABASE [Movies]
GO
CREATE TABLE [dbo].[Movies](
	[MovieId] [int] NOT NULL PRIMARY KEY,
	[Name] [varchar](100) NULL,
	[ReleaseDate] [smalldatetime] NULL,
	[Genre] [varchar](100) NULL
)