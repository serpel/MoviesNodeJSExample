USE [master]
GO
/****** Object:  Database [Movies]    Script Date: 29/10/2018 20:15:01 ******/
CREATE DATABASE [Movies]
GO
CREATE TABLE [dbo].[Movies](
	[MovieId] [int] NOT NULL,
	[Name] [varchar](100) NULL,
	[ReleaseDate] [smalldatetime] NULL,
	[Genre] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[MovieId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
