USE FACILITOONLINE
GO

/* SEGURIDAD */

-- PROCEDURE QUE VALIDA LOGIN
CREATE PROCEDURE USP_USUARIO_LOGIN
@USER_LOGIN NVARCHAR(50),
@USER_PASSWORD NVARCHAR(1000)
WITH ENCRYPTION
AS
DECLARE @FECHA_LIMITE DATETIME,@DIA NVARCHAR(2),@MES NVARCHAR(2),@ANO NVARCHAR(4)
---FECHA---
SET @DIA=CAST(DAY(GETDATE()) AS NVARCHAR(2))
SET @MES=CAST(MONTH(GETDATE()) AS NVARCHAR(2))
SET @ANO=CAST(YEAR(GETDATE()) AS NVARCHAR(4))
IF LEN(@DIA) = 1
	SET @DIA='0+@DIA'
IF LEN(@MES) = 1
    SET @MES='0+@MES'
--TERMINA FECHA---
	SET @FECHA_LIMITE='20161231'--LIMITE 31 dic 2016 20161231
IF(GETDATE()>@FECHA_LIMITE)
	GOTO ERROR
	-- SI PERTENECE A LA TABLA USUARIO
	IF EXISTS(SELECT * 
		FROM tb_usuario U JOIN tb_permiso_usuario P
		ON U.email = P.usuario
		WHERE email=@USER_LOGIN)
	BEGIN
		SELECT nombres 
		FROM tb_usuario u JOIN tb_permiso_usuario P
		ON u.email = P.usuario
		WHERE email=@USER_LOGIN AND contraseña=@USER_PASSWORD AND activo=1
	END
	-- SI PERTENECE A LA TABLA CLIENTE
	ELSE IF EXISTS(SELECT * 
		FROM tb_cliente c JOIN tb_permiso_cliente P
		ON c.membresia = P.cliente
		WHERE membresia=@USER_LOGIN)
	BEGIN
		SELECT razonSocial 
		FROM tb_cliente C JOIN tb_permiso_cliente P
		ON C.membresia = P.cliente
		WHERE membresia=@USER_LOGIN AND clave=@USER_PASSWORD AND activo=1
	END
	RETURN
	ERROR:
	RAISERROR('<br /><b>Error de inicio de sesión, caduco su periodo de prueba más información contactarse con cibertec10.5@hotmail.com</b><br />',16,1)
	GOTO FIN
	RETURN
	FIN:
GO

-- PROCEDURE QUE GESTIONE LOS PERMISOS DE CLIENTE
CREATE PROCEDURE USP_USERS_PERMISOS_MOSTRAR
@USER_LOGIN NVARCHAR(50)
AS
	-- SI PERTENECE A LA TABLA USUARIO
	IF EXISTS(SELECT * 
		FROM tb_usuario U JOIN tb_permiso_usuario P
		ON U.email = P.usuario
		WHERE email=@USER_LOGIN)
	BEGIN
		SELECT * 
		FROM tb_usuario U JOIN tb_permiso_usuario P
		ON U.email = P.usuario
		WHERE email=@USER_LOGIN
	END
	
	-- SI PERTENECE A LA TABLA CLIENTE
	ELSE IF EXISTS(SELECT * 
		FROM tb_cliente c JOIN tb_permiso_cliente P
		ON c.membresia = P.cliente
		WHERE membresia=@USER_LOGIN)
	BEGIN
		SELECT * 
		FROM tb_cliente C JOIN tb_permiso_cliente P
		ON C.membresia = P.cliente
		WHERE membresia=@USER_LOGIN
	END
GO

-- PROCEDURE QUE REGISTRA CLIENTES
CREATE PROCEDURE USP_REGISTRAR_CLIENTE
@MEMBRESIA VARCHAR(50),
@CLAVE VARCHAR(50),
@CONTACTO VARCHAR(50),
@EMAIL VARCHAR(80),
@CARGO INT,
@RAZON_SOCIAL VARCHAR(100),
@CALLE VARCHAR(100),
@NUMERO_EXTERIOR CHAR(10),
@NUMERO_INTERIOR CHAR(10),
@MUNICIPIO VARCHAR(50),
@CODIGO_POSTAL CHAR(5),
@CIUDAD VARCHAR(50),
@PAIS CHAR(3),
@ESTADO INT,
@SITIO_WEB VARCHAR(80),
@ACTIVIDAD_PREPONDERANTE VARCHAR(200),
@LISTADO_PRODUCTOS VARCHAR(200),
@TIPO_CLIENTE INT
AS
INSERT INTO tb_cliente(membresia,clave,nombreContacto,emailContacto,cargoContacto,
razonSocial,calle,numeroExterior,numeroInterior,municipio,codigoPostal,
ciudad,pais,estado,sitioWeb,actividadPreponderante,listadoDeProductos,tipoCliente)
values(@MEMBRESIA,@CLAVE,@CONTACTO,@EMAIL,@CARGO,@RAZON_SOCIAL,@CALLE,@NUMERO_EXTERIOR,
@NUMERO_INTERIOR,@MUNICIPIO,@CODIGO_POSTAL,@CIUDAD,@PAIS,@ESTADO,@SITIO_WEB,
@ACTIVIDAD_PREPONDERANTE,@LISTADO_PRODUCTOS,@TIPO_CLIENTE)
go

-- PROCEDURE QUE REGISTRA USUARIOS
CREATE PROCEDURE USP_REGISTRAR_USUARIO
@EMAIL VARCHAR(50),
@CLAVE CHAR(10),
@NOMBRES VARCHAR(50),
@APELLIDOS VARCHAR(50),
@DIRECCION VARCHAR(100),
@FECHA_NACIMIENTO DATETIME,
@TIPO_USUARIO INT
AS
INSERT INTO tb_usuario(email,contraseña,nombres,apellidos,direccion,fechaDeNacimiento,tipoUsuario)
VALUES(@EMAIL,@CLAVE,@NOMBRES,@APELLIDOS,@DIRECCION,@FECHA_NACIMIENTO,@TIPO_USUARIO)
GO

-- PROCEDURE QUE REGISTRAR LOS PERMISOS A CLIENTES Y USUARIOS
CREATE PROCEDURE USP_REGISTRAR_PERMISOS_CLIENTE_Y_USUARIO
@CLIENTE_O_USUARIO varchar(50)
AS
	-- SI PERTENECE A LA TABLA USUARIO
	IF EXISTS(SELECT * FROM tb_usuario WHERE email=@CLIENTE_O_USUARIO)
	BEGIN
		INSERT INTO tb_permiso_usuario(usuario,activo,administrador,visitante,clienteSocio,clienteInvitado)
		VALUES (@CLIENTE_O_USUARIO,1,0,1,0,0)
	END
	-- SI PERTENECE A LA TABLA CLIENTE
	ELSE IF EXISTS (SELECT * FROM tb_cliente WHERE membresia = @CLIENTE_O_USUARIO)
	BEGIN
		INSERT INTO tb_permiso_cliente(cliente,activo,administrador,visitante,clienteSocio,clienteInvitado)
		VALUES (@CLIENTE_O_USUARIO,1,0,0,0,1)
	END
	RETURN
	ERROR:
	RAISERROR('<br /><b>Error al Validar la cuenta, Es posible que el usuario ingresado sea incorrecto</b><br />',16,1)
	GOTO FIN
	RETURN
	FIN:
GO





/* MANTENIMIENTO DE USUARIOS */

-- PROCEDURE QUE REGISTRA Y MODIFICA UN USUARIO
CREATE PROCEDURE USP_REGISTRA_ACTUALIZA_USUARIO
@EMAIL VARCHAR(50),
@CLAVE CHAR(10),
@NOMBRES VARCHAR(50),
@APELLIDOS VARCHAR(50),
@DIRECCION VARCHAR(100),
@FECHA_NACIMIENTO DATETIME,
@TIPO_USUARIO INT
AS
BEGIN TRANSACTION TUSU
IF NOT EXISTS(SELECT 1 FROM tb_usuario WHERE email=@EMAIL)
BEGIN
	INSERT INTO tb_usuario(email,contraseña,nombres,apellidos,direccion,fechaDeNacimiento,tipoUsuario)
	VALUES(@EMAIL,@CLAVE,@NOMBRES,@APELLIDOS,@DIRECCION,@FECHA_NACIMIENTO,@TIPO_USUARIO)
END
ELSE
BEGIN
	UPDATE tb_usuario SET
	contraseña = @CLAVE,
	nombres = @NOMBRES,
	apellidos = @APELLIDOS,
	direccion = @DIRECCION,
	fechaDeNacimiento = @FECHA_NACIMIENTO,
	tipoUsuario = @TIPO_USUARIO
	WHERE email = @EMAIL
END
COMMIT TRANSACTION TUSU
RETURN
ERROR:
RAISERROR('No se puede ejecutar la acción solicitada',16,1)
ROLLBACK TRANSACTION TUSU
GOTO FIN
RETURN
FIN:
GO

-- PROCEDURE QUE ELIMINA UN USUARIO
CREATE PROCEDURE USP_ELIMINAR_USUARIO
@EMAIL NVARCHAR(50)
AS
	DELETE FROM TB_USUARIO
	WHERE email = @EMAIL and tipoUsuario = 2
GO


/* MANTENIMIENTO DE CLIENTES */

-- PROCEDURE QUE REGISTRA Y MODIFICA UN CLIENTE
CREATE PROCEDURE USP_REGISTRA_ACTUALIZA_CLIENTE
@MEMBRESIA VARCHAR(50),
@CLAVE VARCHAR(50),
@CONTACTO VARCHAR(50),
@EMAIL VARCHAR(80),
@CARGO INT,
@RAZON_SOCIAL VARCHAR(100),
@CALLE VARCHAR(100),
@NUMERO_EXTERIOR CHAR(10),
@NUMERO_INTERIOR CHAR(10),
@MUNICIPIO VARCHAR(50),
@CODIGO_POSTAL CHAR(5),
@CIUDAD VARCHAR(50),
@PAIS CHAR(3),
@ESTADO INT,
@SITIO_WEB VARCHAR(80),
@ACTIVIDAD_PREPONDERANTE VARCHAR(200),
@LISTADO_PRODUCTOS VARCHAR(200),
@TIPO_CLIENTE INT
AS
BEGIN TRANSACTION TCLI
IF NOT EXISTS(SELECT 1 FROM tb_CLIENTE WHERE membresia = @MEMBRESIA)
BEGIN
	INSERT INTO tb_cliente(membresia,clave,nombreContacto,emailContacto,cargoContacto,
	razonSocial,calle,numeroExterior,numeroInterior,municipio,codigoPostal,
	ciudad,pais,estado,sitioWeb,actividadPreponderante,listadoDeProductos,tipoCliente)
	values(@MEMBRESIA,@CLAVE,@CONTACTO,@EMAIL,@CARGO,@RAZON_SOCIAL,@CALLE,@NUMERO_EXTERIOR,
	@NUMERO_INTERIOR,@MUNICIPIO,@CODIGO_POSTAL,@CIUDAD,@PAIS,@ESTADO,@SITIO_WEB,
	@ACTIVIDAD_PREPONDERANTE,@LISTADO_PRODUCTOS,@TIPO_CLIENTE)
END
ELSE
BEGIN
	UPDATE tb_cliente SET
	clave = @CLAVE,
	nombreContacto = @CONTACTO,
	emailContacto = @EMAIL,
	cargoContacto = @CARGO,
	razonSocial = @RAZON_SOCIAL,
	calle = @CALLE,
	numeroExterior = @NUMERO_EXTERIOR,
	numeroInterior = @NUMERO_INTERIOR,
	municipio = @MUNICIPIO,
	codigoPostal = @CODIGO_POSTAL,
	ciudad = @CIUDAD,
	pais = @PAIS,
	estado = @ESTADO,
	sitioWeb = @SITIO_WEB,
	actividadPreponderante = @ACTIVIDAD_PREPONDERANTE,
	listadoDeProductos = @LISTADO_PRODUCTOS,
	tipoCliente = @TIPO_CLIENTE
	WHERE membresia = @MEMBRESIA
END
COMMIT TRANSACTION TCLI
RETURN
ERROR:
RAISERROR('No se puede ejecutar la acción solicitada',16,1)
ROLLBACK TRANSACTION TCLI
GOTO FIN
RETURN
FIN:
GO

-- PROCEDURE QUE ELIMINA CLIENTES
ALTER PROCEDURE USP_ELIMINA_CLIENTES
@MEMBRESIA VARCHAR(50)
AS
DELETE tb_cliente
WHERE membresia= @MEMBRESIA 
go





/* MANTENIMIENTOS DE PERMISOS DE USUARIOS Y CLIENTES */

-- PROCEDURE QUE REGISTRAR Y MODIFICA PERMISOS A CLIENTES Y USUARIOS
CREATE PROCEDURE USP_REGISTRA_Y_ACTUALIZA_PERMISOS_CLIENTE_Y_USUARIO
@CLIENTE_O_USUARIO varchar(50),
@ACTIVO BIT,
@ADMINISTRADOR BIT,
@VISITANTE BIT,
@CLIENTESOCIO BIT,
@CLIENTEINVITADO BIT
AS
	-- SI PERTENECE A LA TABLA USUARIO
	IF EXISTS(SELECT * FROM tb_usuario WHERE email=@CLIENTE_O_USUARIO)
	BEGIN
		BEGIN TRANSACTION TPER_USU
		IF NOT EXISTS(SELECT 1 FROM tb_permiso_usuario WHERE usuario=@CLIENTE_O_USUARIO)
		BEGIN
		    -- INSERTAR PERMISO USUARIO
			INSERT INTO tb_permiso_usuario(usuario,activo,administrador,visitante,clienteSocio,clienteInvitado)
			VALUES(@CLIENTE_O_USUARIO,@ACTIVO,@ADMINISTRADOR,@VISITANTE,@CLIENTESOCIO,@CLIENTEINVITADO)
		END
		ELSE
		BEGIN
		    -- ACTUALIZAR PERMISO USUARIO
			UPDATE tb_permiso_usuario SET
			activo = @ACTIVO,
			administrador = @ADMINISTRADOR,
			visitante = @VISITANTE,
			clienteSocio = @CLIENTESOCIO,
			clienteInvitado = @CLIENTEINVITADO
			WHERE usuario = @CLIENTE_O_USUARIO
		END
		COMMIT TRANSACTION TPER_USU
		RETURN
		ERROR1:
		RAISERROR('No se puede ejecutar la acción solicitada',16,1)
		ROLLBACK TRANSACTION TPER_USU
		GOTO FIN1
		RETURN
		FIN1:
	END
	-- SI PERTENECE A LA TABLA CLIENTE
	ELSE IF EXISTS (SELECT * FROM tb_cliente WHERE membresia = @CLIENTE_O_USUARIO)
	BEGIN
		BEGIN TRANSACTION TPER_CLI
		IF NOT EXISTS(SELECT 1 FROM tb_permiso_cliente WHERE cliente=@CLIENTE_O_USUARIO)
		BEGIN
		    -- INSERTAR PERMISO CLIENTE
			INSERT INTO tb_permiso_cliente(cliente, activo,administrador,visitante,clienteSocio,clienteInvitado)
			VALUES(@CLIENTE_O_USUARIO,@ACTIVO,@ADMINISTRADOR,@VISITANTE,@CLIENTESOCIO,@CLIENTEINVITADO)
		END
		ELSE
		BEGIN
		    -- ACTUALIZAR CLIENTE
			UPDATE tb_permiso_cliente SET
			activo = @ACTIVO,
			administrador = @ADMINISTRADOR,
			visitante = @VISITANTE,
			clienteSocio = @CLIENTESOCIO,
			clienteInvitado = @CLIENTEINVITADO
			WHERE cliente = @CLIENTE_O_USUARIO
		END
		COMMIT TRANSACTION TPER_CLI
		RETURN
		ERROR2:
		RAISERROR('No se puede ejecutar la acción solicitada',16,1)
		ROLLBACK TRANSACTION TPER_CLI
		GOTO FIN2
		RETURN
		FIN2:
	END
	
	
	RETURN
	ERROR3:
	RAISERROR('<br /><b>Error al Validar la cuenta, Es posible que el usuario ingresado sea incorrecto</b><br />',16,1)
	GOTO FIN3
	RETURN
	FIN3:
GO

alter PROCEDURE USP_LISTA_CLIENTES_Y_USUARIOS_SIN_PERMISOS
as
select email,nombres+' '+apellidos as usuarios,descripcion from tb_usuario u join tb_tipo_usuario tu on u.tipoUsuario = tu.id_tipo_usuario
where email not in (select usuario from tb_permiso_usuario)
union
select membresia,nombreContacto,descripcion from tb_cliente c join tb_tipo_cliente tc on c.tipoCliente = tc.id_tipo_cliente
where membresia not in (select cliente from tb_permiso_cliente)
GO





/* ANUNCIOS */

-- PROCEDURE QUE REGISTRA ANUNCIOS
create procedure USP_REGISTRAR_ANUNCIOS
@titulo varchar(50),
@descripcion varchar(max),
@imagen image,
@ruc varchar(100) 
as
insert into tb_anuncios(titulo,descripcion,imagen,ruc)
values(@titulo,@descripcion,@imagen,@ruc)
go

-- PROCEDURE QUE MODIFICA ANUNCIOS
create procedure USP_MODIFICAR_ANUNCIOM
@cod int,
@titulo varchar(50),
@descripcion varchar(max),
@imagen image,
@var int
as
	IF (@var =1)
	BEGIN
		update tb_anuncios 
		set titulo=@titulo,descripcion=@descripcion,imagen=@imagen
		where cod = @cod
	END
		ELSE IF (@var =2)
	BEGIN
		update tb_anuncios 
		set titulo=@titulo,descripcion=@descripcion
		where cod = @cod
	END
go	

-- PROCEDURE QUE ELIMINA ANUNCIOS
create procedure USP_ELIMINAR_ANUNCIO
@titulo varchar(50)
as
delete from tb_anuncios where titulo=@titulo
go





/* CATEGORÍAS */

-- PROCEDURE QUE REGISTAR NUEVAS CATEGORÍAS
create procedure USP_AGREGAR_CATEGORIA
@categoria varchar(50)
as
insert into tb_categoria_prod  (descripcion) values (@categoria)
go

-- PROCEDURE QUE ELIMINA CATEGORÍAS DE PRODUCTOS
create procedure USP_MODIFICAR_CATEGORIA
@id int,
@descripcion varchar(50)
as
update tb_categoria_prod set descripcion=@descripcion where id= @id
go





/* PRODUCTOS */

create procedure USP_LISTAR_PROD_CATEGO_xRuc
@ruc varchar(100)
as
select p.* ,c.descripcion
from tb_productos p
join tb_categoria_prod c
on p.Categoria = c.id
where p.ruc=@ruc
go

create procedure USP_INSERTAR_PRODUCTO
@nombre varchar(50),
@categoria int,
@cantidad int,
@precio decimal(10,2),
@imagen image,
@ruc varchar(100)
as
insert into tb_productos (nombre,Categoria,Cantidad,Precio,imagen,ruc)
		values(@nombre,@categoria,@cantidad,@precio,@imagen,@ruc)
go

create procedure USP_MODIFICAR_PRODUCTO
@cod int,
@nombre varchar(50),
@categoria int,
@cantidad int,
@precio decimal(10,2),
@imagen image,
@var int
as
	IF (@var =1)
	BEGIN
		update tb_productos
		set nombre=@nombre,Categoria=@categoria,Cantidad=@cantidad,Precio=@precio,imagen=@imagen
		where id = @cod		
	END
		ELSE IF (@var =2)
	BEGIN
		update tb_productos
		set nombre=@nombre,Categoria=@categoria,Cantidad=@cantidad,Precio=@precio
		where id = @cod
	END
go	

create procedure USP_ELIMINAR_PRODUCTO
@nom varchar(50)
as
delete from tb_productos
where nombre=@nom
go

create procedure USP_UBICARPRODUCTO
@nom varchar(50)
as
select * from tb_productos where nombre=@nom
go


/* CATALOGOS */

