USE [FacilitoOnline]
GO
/****** Object:  Table [dbo].[tb_tipo_usuario]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_tipo_usuario](
	[id_tipo_usuario] [int] NOT NULL,
	[descripcion] [char](20) NOT NULL,
 CONSTRAINT [PK_tb_tipo_usuario] PRIMARY KEY CLUSTERED 
(
	[id_tipo_usuario] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_tipo_cliente]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_tipo_cliente](
	[id_tipo_cliente] [int] NOT NULL,
	[descripcion] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tb_cliente] PRIMARY KEY CLUSTERED 
(
	[id_tipo_cliente] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_categoria_prod]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_categoria_prod](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_cargo]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_cargo](
	[id] [int] NOT NULL,
	[cargo] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tb_cargo] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_anuncios]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_anuncios](
	[cod] [int] IDENTITY(1,1) NOT NULL,
	[titulo] [varchar](50) NULL,
	[descripcion] [varchar](max) NULL,
	[imagen] [image] NULL,
	[ruc] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[cod] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_pais]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_pais](
	[id] [char](3) NOT NULL,
	[pais] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tb_pais] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_estado]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_estado](
	[id] [int] NOT NULL,
	[estado] [varchar](50) NOT NULL,
	[pais] [char](3) NOT NULL,
 CONSTRAINT [PK_tb_estado] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_cliente]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_cliente](
	[membresia] [varchar](50) NOT NULL,
	[clave] [varchar](50) NOT NULL,
	[nombreContacto] [varchar](50) NOT NULL,
	[emailContacto] [varchar](80) NOT NULL,
	[cargoContacto] [int] NOT NULL,
	[razonSocial] [varchar](100) NOT NULL,
	[calle] [varchar](100) NOT NULL,
	[numeroExterior] [char](10) NOT NULL,
	[numeroInterior] [char](10) NULL,
	[municipio] [char](50) NOT NULL,
	[codigoPostal] [char](5) NOT NULL,
	[ciudad] [varchar](50) NOT NULL,
	[pais] [char](3) NOT NULL,
	[estado] [int] NOT NULL,
	[sitioWeb] [varchar](80) NULL,
	[actividadPreponderante] [varchar](200) NULL,
	[listadoDeProductos] [varchar](200) NULL,
	[tipoCliente] [int] NOT NULL,
 CONSTRAINT [PK_tb_cliente_1] PRIMARY KEY CLUSTERED 
(
	[membresia] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_usuario]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_usuario](
	[email] [varchar](50) NOT NULL,
	[contraseña] [char](10) NOT NULL,
	[nombres] [varchar](50) NOT NULL,
	[apellidos] [varchar](50) NOT NULL,
	[direccion] [varchar](100) NOT NULL,
	[fechaDeNacimiento] [datetime] NOT NULL,
	[tipoUsuario] [int] NOT NULL,
	[fechaDeRegistro] [datetime] NOT NULL,
 CONSTRAINT [PK_tb_usuario] PRIMARY KEY CLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_productos]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_productos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[Categoria] [int] NULL,
	[Cantidad] [int] NULL,
	[Precio] [decimal](10, 2) NULL,
	[imagen] [image] NULL,
	[ruc] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_permiso_usuario]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_permiso_usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[usuario] [varchar](50) NOT NULL,
	[activo] [bit] NOT NULL,
	[administrador] [bit] NOT NULL,
	[visitante] [bit] NOT NULL,
	[clienteSocio] [bit] NOT NULL,
	[clienteInvitado] [bit] NOT NULL,
 CONSTRAINT [PK_tb_permisocliente] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [U_USUARIO] UNIQUE NONCLUSTERED 
(
	[usuario] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_permiso_cliente]    Script Date: 12/08/2012 22:37:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_permiso_cliente](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cliente] [varchar](50) NOT NULL,
	[activo] [bit] NOT NULL,
	[administrador] [bit] NOT NULL,
	[visitante] [bit] NOT NULL,
	[clienteSocio] [bit] NOT NULL,
	[clienteInvitado] [bit] NOT NULL,
 CONSTRAINT [PK_tb_permisos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
 CONSTRAINT [U_CLIENTE] UNIQUE NONCLUSTERED 
(
	[cliente] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Default [DF_tb_usuario_fechaDeRegistro]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_usuario] ADD  CONSTRAINT [DF_tb_usuario_fechaDeRegistro]  DEFAULT (getdate()) FOR [fechaDeRegistro]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_cargo1]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_cargo1] FOREIGN KEY([cargoContacto])
REFERENCES [dbo].[tb_cargo] ([id])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_cargo1]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_pais1]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_pais1] FOREIGN KEY([pais])
REFERENCES [dbo].[tb_pais] ([id])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_pais1]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_tipo_cliente]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_tipo_cliente] FOREIGN KEY([tipoCliente])
REFERENCES [dbo].[tb_tipo_cliente] ([id_tipo_cliente])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_tipo_cliente]
GO
/****** Object:  ForeignKey [FK_tb_estado_tb_pais1]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_estado]  WITH CHECK ADD  CONSTRAINT [FK_tb_estado_tb_pais1] FOREIGN KEY([pais])
REFERENCES [dbo].[tb_pais] ([id])
GO
ALTER TABLE [dbo].[tb_estado] CHECK CONSTRAINT [FK_tb_estado_tb_pais1]
GO
/****** Object:  ForeignKey [FK_tb_permisos_tb_cliente]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_permiso_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_permisos_tb_cliente] FOREIGN KEY([cliente])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_permiso_cliente] CHECK CONSTRAINT [FK_tb_permisos_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_permiso_usuario_tb_usuario]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_permiso_usuario]  WITH CHECK ADD  CONSTRAINT [FK_tb_permiso_usuario_tb_usuario] FOREIGN KEY([usuario])
REFERENCES [dbo].[tb_usuario] ([email])
GO
ALTER TABLE [dbo].[tb_permiso_usuario] CHECK CONSTRAINT [FK_tb_permiso_usuario_tb_usuario]
GO
/****** Object:  ForeignKey [FK__tb_produc__Categ__540C7B00]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_productos]  WITH CHECK ADD FOREIGN KEY([Categoria])
REFERENCES [dbo].[tb_categoria_prod] ([id])
GO
/****** Object:  ForeignKey [FK_tb_usuario_tb_tipo_usuario1]    Script Date: 12/08/2012 22:37:39 ******/
ALTER TABLE [dbo].[tb_usuario]  WITH CHECK ADD  CONSTRAINT [FK_tb_usuario_tb_tipo_usuario1] FOREIGN KEY([tipoUsuario])
REFERENCES [dbo].[tb_tipo_usuario] ([id_tipo_usuario])
GO
ALTER TABLE [dbo].[tb_usuario] CHECK CONSTRAINT [FK_tb_usuario_tb_tipo_usuario1]
GO
