USE [FacilitoOnline]
GO
/****** Object:  Table [dbo].[tb_pais]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_tipo_usuario]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_tipo_cliente]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_categoria_prod]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_cargo]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_cotizacion]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_cotizacion](
	[id] [int] NULL,
	[usuario] [varchar](50) NULL,
	[cliente] [varchar](50) NULL,
	[nro_personas] [int] NULL,
	[mot_usuario] [varchar](200) NULL,
	[fecha_solicitud] [smalldatetime] NULL,
	[fecha_respuesta] [smalldatetime] NULL,
	[precio] [decimal](11, 2) NULL,
	[resp_cliente] [varchar](200) NULL
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_estado]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_estado](
	[id] [char](6) NOT NULL,
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
/****** Object:  Table [dbo].[tb_usuario]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_ofertas]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_ofertas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[oferta] [varchar](100) NOT NULL,
	[descripcion] [varchar](500) NULL,
	[fecha_inicio] [datetime] NULL,
	[fecha_fin] [datetime] NULL,
	[estado] [bit] NULL,
	[fechaRegistro] [datetime] NOT NULL,
	[cliente] [varchar](50) NOT NULL,
	[producto] [int] NOT NULL,
	[precioActual] [float] NOT NULL,
	[precioOferta] [float] NOT NULL,
 CONSTRAINT [PK__tb_ofert__3213E83F5D95E53A] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_eventos]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_eventos](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[evento] [varchar](100) NOT NULL,
	[descripcion] [varchar](500) NULL,
	[fecha_inicio] [datetime] NULL,
	[fecha_fin] [datetime] NULL,
	[estado] [bit] NULL,
	[fechaRegistro] [datetime] NULL,
	[cliente] [varchar](50) NOT NULL,
 CONSTRAINT [PK__tb_event__3213E83F6166761E] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_permiso_usuario]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_permiso_cliente]    Script Date: 01/26/2013 17:56:06 ******/
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
/****** Object:  Table [dbo].[tb_reservas]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_reservas](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ruc] [varchar](100) NOT NULL,
	[municipio] [char](50) NULL,
	[fecha_res] [date] NOT NULL,
	[hora] [int] NULL,
	[cantidad] [int] NULL,
	[usuario] [varchar](50) NULL,
	[fecha_reg] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_productos]    Script Date: 01/26/2013 17:56:06 ******/
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
	[usuario] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_comentario]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_comentario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[comentario] [varchar](500) NULL,
	[fecha] [datetime] NOT NULL,
	[usuario] [varchar](50) NOT NULL,
	[cliente] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tb_comentario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_anuncios]    Script Date: 01/26/2013 17:56:06 ******/
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
	[membresia] [varchar](50) NOT NULL,
 CONSTRAINT [PK__tb_anunc__D8360F7B47A6A41B] PRIMARY KEY CLUSTERED 
(
	[cod] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[provincias]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[provincias](
	[idprovincia] [char](6) NOT NULL,
	[nomprovincia] [varchar](50) NOT NULL,
	[departamento] [char](6) NOT NULL,
 CONSTRAINT [PK_provincias] PRIMARY KEY CLUSTERED 
(
	[idprovincia] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[distritos]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[distritos](
	[id_distrito] [char](6) NOT NULL,
	[desc_dist] [varchar](100) NOT NULL,
	[provincia] [char](6) NOT NULL,
 CONSTRAINT [PK__tb_distr__65E5575D65370702] PRIMARY KEY CLUSTERED 
(
	[id_distrito] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_post]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_post](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subComentario] [varchar](500) NOT NULL,
	[usuario] [varchar](50) NOT NULL,
	[comentario] [int] NOT NULL,
	[fechaDeRegistro] [datetime] NOT NULL,
 CONSTRAINT [PK_tb_post] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tb_sucursal]    Script Date: 01/26/2013 17:56:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tb_sucursal](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sucursal] [varchar](100) NOT NULL,
	[desc_sucursal] [varchar](200) NULL,
	[telefono] [varchar](20) NULL,
	[id_distrito] [char](6) NOT NULL,
	[direccion] [varchar](100) NULL,
	[fecha_inscripcion] [datetime] NOT NULL,
	[cliente] [varchar](50) NOT NULL,
 CONSTRAINT [PK__tb_sucur__3213E83F690797E6] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
/****** Object:  Default [DF_tb_comentario_fecha]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_comentario] ADD  CONSTRAINT [DF_tb_comentario_fecha]  DEFAULT (getdate()) FOR [fecha]
GO
/****** Object:  Default [DF_tb_eventos_fechaRegistro]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_eventos] ADD  CONSTRAINT [DF_tb_eventos_fechaRegistro]  DEFAULT (getdate()) FOR [fechaRegistro]
GO
/****** Object:  Default [DF_tb_ofertas_fechaRegistro]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_ofertas] ADD  CONSTRAINT [DF_tb_ofertas_fechaRegistro]  DEFAULT (getdate()) FOR [fechaRegistro]
GO
/****** Object:  Default [DF_tb_post_fechaDeRegistro]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_post] ADD  CONSTRAINT [DF_tb_post_fechaDeRegistro]  DEFAULT (getdate()) FOR [fechaDeRegistro]
GO
/****** Object:  Default [DF__tb_sucurs__fecha__6AEFE058]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_sucursal] ADD  CONSTRAINT [DF__tb_sucurs__fecha__6AEFE058]  DEFAULT (getdate()) FOR [fecha_inscripcion]
GO
/****** Object:  Default [DF_tb_usuario_fechaDeRegistro]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_usuario] ADD  CONSTRAINT [DF_tb_usuario_fechaDeRegistro]  DEFAULT (getdate()) FOR [fechaDeRegistro]
GO
/****** Object:  ForeignKey [FK_distritos_provincias]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[distritos]  WITH CHECK ADD  CONSTRAINT [FK_distritos_provincias] FOREIGN KEY([provincia])
REFERENCES [dbo].[provincias] ([idprovincia])
GO
ALTER TABLE [dbo].[distritos] CHECK CONSTRAINT [FK_distritos_provincias]
GO
/****** Object:  ForeignKey [FK_provincias_tb_estado]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[provincias]  WITH CHECK ADD  CONSTRAINT [FK_provincias_tb_estado] FOREIGN KEY([departamento])
REFERENCES [dbo].[tb_estado] ([id])
GO
ALTER TABLE [dbo].[provincias] CHECK CONSTRAINT [FK_provincias_tb_estado]
GO
/****** Object:  ForeignKey [FK_tb_anuncios_tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_anuncios]  WITH CHECK ADD  CONSTRAINT [FK_tb_anuncios_tb_cliente] FOREIGN KEY([membresia])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_anuncios] CHECK CONSTRAINT [FK_tb_anuncios_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_cargo1]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_cargo1] FOREIGN KEY([cargoContacto])
REFERENCES [dbo].[tb_cargo] ([id])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_cargo1]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_pais1]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_pais1] FOREIGN KEY([pais])
REFERENCES [dbo].[tb_pais] ([id])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_pais1]
GO
/****** Object:  ForeignKey [FK_tb_cliente_tb_tipo_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_cliente_tb_tipo_cliente] FOREIGN KEY([tipoCliente])
REFERENCES [dbo].[tb_tipo_cliente] ([id_tipo_cliente])
GO
ALTER TABLE [dbo].[tb_cliente] CHECK CONSTRAINT [FK_tb_cliente_tb_tipo_cliente]
GO
/****** Object:  ForeignKey [FK_tb_comentario_tb_usuario]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_comentario]  WITH CHECK ADD  CONSTRAINT [FK_tb_comentario_tb_usuario] FOREIGN KEY([usuario])
REFERENCES [dbo].[tb_usuario] ([email])
GO
ALTER TABLE [dbo].[tb_comentario] CHECK CONSTRAINT [FK_tb_comentario_tb_usuario]
GO
/****** Object:  ForeignKey [FK_tb_estado_tb_pais]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_estado]  WITH CHECK ADD  CONSTRAINT [FK_tb_estado_tb_pais] FOREIGN KEY([pais])
REFERENCES [dbo].[tb_pais] ([id])
GO
ALTER TABLE [dbo].[tb_estado] CHECK CONSTRAINT [FK_tb_estado_tb_pais]
GO
/****** Object:  ForeignKey [FK_tb_eventos_tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_eventos]  WITH CHECK ADD  CONSTRAINT [FK_tb_eventos_tb_cliente] FOREIGN KEY([cliente])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_eventos] CHECK CONSTRAINT [FK_tb_eventos_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_ofertas_tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_ofertas]  WITH CHECK ADD  CONSTRAINT [FK_tb_ofertas_tb_cliente] FOREIGN KEY([cliente])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_ofertas] CHECK CONSTRAINT [FK_tb_ofertas_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_permisos_tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_permiso_cliente]  WITH CHECK ADD  CONSTRAINT [FK_tb_permisos_tb_cliente] FOREIGN KEY([cliente])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_permiso_cliente] CHECK CONSTRAINT [FK_tb_permisos_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_permiso_usuario_tb_usuario]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_permiso_usuario]  WITH CHECK ADD  CONSTRAINT [FK_tb_permiso_usuario_tb_usuario] FOREIGN KEY([usuario])
REFERENCES [dbo].[tb_usuario] ([email])
GO
ALTER TABLE [dbo].[tb_permiso_usuario] CHECK CONSTRAINT [FK_tb_permiso_usuario_tb_usuario]
GO
/****** Object:  ForeignKey [FK_tb_post_tb_comentario1]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_post]  WITH CHECK ADD  CONSTRAINT [FK_tb_post_tb_comentario1] FOREIGN KEY([comentario])
REFERENCES [dbo].[tb_comentario] ([id])
GO
ALTER TABLE [dbo].[tb_post] CHECK CONSTRAINT [FK_tb_post_tb_comentario1]
GO
/****** Object:  ForeignKey [FK__tb_produc__Categ__725BF7F6]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_productos]  WITH CHECK ADD FOREIGN KEY([Categoria])
REFERENCES [dbo].[tb_categoria_prod] ([id])
GO
/****** Object:  ForeignKey [FK__tb_produc__usuar__73501C2F]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_productos]  WITH CHECK ADD FOREIGN KEY([usuario])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
/****** Object:  ForeignKey [FK__tb_reserv__usuar__7908F585]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_reservas]  WITH CHECK ADD FOREIGN KEY([usuario])
REFERENCES [dbo].[tb_usuario] ([email])
GO
/****** Object:  ForeignKey [FK_tb_sucursal_distritos]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_sucursal]  WITH CHECK ADD  CONSTRAINT [FK_tb_sucursal_distritos] FOREIGN KEY([id_distrito])
REFERENCES [dbo].[distritos] ([id_distrito])
GO
ALTER TABLE [dbo].[tb_sucursal] CHECK CONSTRAINT [FK_tb_sucursal_distritos]
GO
/****** Object:  ForeignKey [FK_tb_sucursal_tb_cliente]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_sucursal]  WITH CHECK ADD  CONSTRAINT [FK_tb_sucursal_tb_cliente] FOREIGN KEY([cliente])
REFERENCES [dbo].[tb_cliente] ([membresia])
GO
ALTER TABLE [dbo].[tb_sucursal] CHECK CONSTRAINT [FK_tb_sucursal_tb_cliente]
GO
/****** Object:  ForeignKey [FK_tb_usuario_tb_tipo_usuario1]    Script Date: 01/26/2013 17:56:06 ******/
ALTER TABLE [dbo].[tb_usuario]  WITH CHECK ADD  CONSTRAINT [FK_tb_usuario_tb_tipo_usuario1] FOREIGN KEY([tipoUsuario])
REFERENCES [dbo].[tb_tipo_usuario] ([id_tipo_usuario])
GO
ALTER TABLE [dbo].[tb_usuario] CHECK CONSTRAINT [FK_tb_usuario_tb_tipo_usuario1]
GO
