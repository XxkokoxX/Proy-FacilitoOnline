<%@ Page Title="" Language="C#" MasterPageFile="~/Principal.master" AutoEventWireup="true" CodeFile="Prueba.aspx.cs" Inherits="Prueba" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <fieldset id="registrousuario">
<form>
<legend>Registro de Nuevo Usuario</legend>
<label for="user">Usuario:</label>
<input class="texto" name="username " type="text" size="20" />
<label for="pass">Contraseña:</label>
<input class="texto" name="password" type="password" size="20" />
<label for="pass">E-mail:</label>
<input class="texto" name="email " type="text" size="20" />
<label for="pass">Nombres:</label>
<input class="texto" name="firstname" type="text" size="20" />
<label for="pass">Apellidos:</label>
<input class="texto" name="lastname " type="text" size="20" />
<label for="pass">Dirección:</label> 
<textarea class="areadetexto" name="address" cols="26" rows="3">
</textarea> 
<br /> 
<input class="botonenviar" name="insert" type="submit" value="Enviar" class="enviar"/> 
</form> 
</fieldset>
</asp:Content>

