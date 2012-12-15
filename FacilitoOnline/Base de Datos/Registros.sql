USE FACILITOONLINE
GO

-- INSERTAR TIPO DE USUARIO
insert into tb_tipo_usuario(id_tipo_usuario,descripcion)
values(1,'Administrador')
insert into tb_tipo_usuario(id_tipo_usuario,descripcion)
values(2,'Visitante')

-- INSERTAR TIPO CLIENTE
INSERT INTO TB_TIPO_CLIENTE(id_tipo_cliente,descripcion)
VALUES(1,'Invitado')
INSERT INTO TB_TIPO_CLIENTE(id_tipo_cliente,descripcion)
VALUES(2,'Socio')

-- INSERTAR CARGOS
insert into tb_cargo(id,cargo)
values(1,'Dueño / Propietario')
insert into tb_cargo(id,cargo)
values(2,'Estudiante')
insert into tb_cargo(id,cargo)
values(3,'Gerente')
insert into tb_cargo(id,cargo)
values(4,'Otro')
insert into tb_cargo(id,cargo)
values(5,'Profesionista')
go

-- INSERTAR PAISES
INSERT INTO tb_pais VALUES('001', 'Peru')
INSERT INTO tb_pais VALUES('002', 'Argentina')
INSERT INTO tb_pais VALUES('003', 'Chile')
INSERT INTO tb_pais VALUES('004', 'USA')
INSERT INTO tb_pais VALUES('005', 'España')
INSERT INTO tb_pais VALUES('006', 'Francia')
INSERT INTO tb_pais VALUES('007', 'Colombia')
INSERT INTO tb_pais VALUES('008', 'Canada')
INSERT INTO tb_pais VALUES('009', 'China')
go

-- INSERTAR ESTADO POR PAIS
insert into tb_estado(id,estado,pais)
values(1,'Amazonas','001')
insert into tb_estado(id,estado,pais)
values(2,'Áncash','001')
insert into tb_estado(id,estado,pais)
values(3,'Apurímac','001')
insert into tb_estado(id,estado,pais)
values(4,'Arequipa','001')
insert into tb_estado(id,estado,pais)
values(5,'Ayacucho','001')
insert into tb_estado(id,estado,pais)
values(6,'Cajamarca','001')
insert into tb_estado(id,estado,pais)
values(7,'Callao','001')
insert into tb_estado(id,estado,pais)
values(8,'Cusco','001')
insert into tb_estado(id,estado,pais)
values(9,'Huancavelica','001')
insert into tb_estado(id,estado,pais)
values(10,'Huánuco','001')
insert into tb_estado(id,estado,pais)
values(11,'Ica','001')
insert into tb_estado(id,estado,pais)
values(12,'Junín','001')
insert into tb_estado(id,estado,pais)
values(13,'La Libertad','001')
insert into tb_estado(id,estado,pais)
values(14,'Lambayeque','001')
insert into tb_estado(id,estado,pais)
values(15,'Lima','001')
insert into tb_estado(id,estado,pais)
values(16,'Loreto','001')
insert into tb_estado(id,estado,pais)
values(17,'Madre de Dios','001')
insert into tb_estado(id,estado,pais)
values(18,'Moquegua','001')
insert into tb_estado(id,estado,pais)
values(19,'Pasco','001')
insert into tb_estado(id,estado,pais)
values(20,'Piura','001')
insert into tb_estado(id,estado,pais)
values(21,'Puno','001')
insert into tb_estado(id,estado,pais)
values(22,'San Martín','001')
insert into tb_estado(id,estado,pais)
values(23,'Tacna','001')
insert into tb_estado(id,estado,pais)
values(24,'Tumbes','001')
insert into tb_estado(id,estado,pais)
values(25,'Ucayali','001')
go

-- INSERTAR USUARIO
insert into tb_usuario(email,contraseña,nombres,apellidos,direccion,fechaDeNacimiento,tipoUsuario,fechaDeRegistro)
values('admin','admin','José Luis','Toro Alcarraz','Jr. los Inkas #393 Independencia','30/01/1992',1,'27/11/2012')
insert into tb_usuario(email,contraseña,nombres,apellidos,direccion,fechaDeNacimiento,tipoUsuario,fechaDeRegistro)
values('hack10.5@hotmail.com','123456','Nestor Michael','Morales Alarcón','Jr. las Rosas #234 Surco','20/02/1990',2,'27/11/2012')

-- INSERTAR PERMISOS DE USUARIO
INSERT INTO tb_permiso_usuario(usuario,activo,administrador,visitante,clienteSocio,clienteInvitado)
VALUES('admin',1,1,1,1,1)
INSERT INTO tb_permiso_usuario(usuario,activo,administrador,visitante,clienteSocio,clienteInvitado)
VALUES('hack10.5@hotmail.com',1,0,1,0,0)
go

-- INSERTAR CLIENTES
insert into tb_cliente(membresia,clave,nombreContacto,emailContacto,cargoContacto,razonSocial,
calle,numeroExterior,numeroInterior,municipio,codigoPostal,ciudad,pais,estado,sitioWeb,
actividadPreponderante,listadoDeProductos,tipoCliente)
values('jarmando','jarmando','José Armando Soto Vega','jarmando@hotmail.com',1,'El Rincón del Sabor S.A',
'Los Quechuas','393','125','Los Portales',19,'San Luis','001',1,'www.ricondelsabor.com',
'Restaurantes','...',1)
insert into tb_cliente(membresia,clave,nombreContacto,emailContacto,cargoContacto,razonSocial,
calle,numeroExterior,numeroInterior,municipio,codigoPostal,ciudad,pais,estado,sitioWeb,
actividadPreponderante,listadoDeProductos,tipoCliente)
values('mrios','mrios','Mario Rios Soto','mrios@hotmail.com',1,'PortoMar S.A',
'Los Incas','324',null,'Las Rosas',19,'San Miguel','001',1,'www.portomar.com',
'Restaurantes','...',2)
go

-- INSERTAR PERMISOS DE CLIENTE
INSERT INTO tb_permiso_cliente(cliente,activo,administrador,visitante,clienteSocio,clienteInvitado)
VALUES('jarmando',1,0,0,0,1)
INSERT INTO tb_permiso_cliente(cliente,activo,administrador,visitante,clienteSocio,clienteInvitado)
VALUES('mrios',1,0,0,1,0)
go

-- INSERTAR CATEGORIAS
insert into tb_categoria_prod values('Ensaladas')
insert into tb_categoria_prod values('Sopa')
insert into tb_categoria_prod values('Entradas')
insert into tb_categoria_prod values('Postre')
insert into tb_categoria_prod values('Bebidas')
go


-- DEFIRNIR CONSTRAINTS
ALTER TABLE tb_permiso_usuario
ADD CONSTRAINT U_USUARIO
UNIQUE NONCLUSTERED (usuario)
GO
ALTER TABLE tb_permiso_cliente
ADD CONSTRAINT U_CLIENTE
UNIQUE NONCLUSTERED (cliente)
GO
