<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Login_Usuario.aspx.cs" Inherits="Login_Usuario" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Usuario Inicia Sesión</title>
    <!-- Archivos Iniciar Sesión -->
    <link href="estilos/Inicia_Sesion_files/bligoo-admin.css" rel="stylesheet" type="text/css" />
    <link href="estilos/Inicia_Sesion_files/bligoo-explora.css" rel="stylesheet" type="text/css" />
    <link href="estilos/Inicia_Sesion_files/stylesheet.css" rel="stylesheet" type="text/css" />
    <script src="estilos/Inicia_Sesion_files/anonymous.js" type="text/javascript"></script>
    <!-- JQuery mensajes modelo 1-->
    <script src="estilos/MensajesjQuery/jquery-1.2.6.js" type="text/javascript"></script>
    <style type="text/css">
    .info, .exito, .alerta, .error {
        font-family:Arial, Helvetica, sans-serif; 
        font-size:13px;
        border: 1px solid;
        margin: 10px 0px;
        padding:15px 10px 15px 50px;
        background-repeat: no-repeat;
        background-position: 10px center;
    }
    .info {
        color: #00529B;
        background-color: #BDE5F8;
        background-image: url('estilos/MensajesjQuery/info.png');
    }
    .exito {
        color: #4F8A10;
        background-color: #DFF2BF;
        background-image:url('estilos/MensajesjQuery/exito.png');
    }
    .alerta {
        color: #9F6000;
        background-color: #FEEFB3;
        background-image: url('estilos/MensajesjQuery/alerta.png');
    }
    .error {
        color: #D8000C;
        background-color: #FFBABA;
        background-image: url('estilos/MensajesjQuery/error.png');
    }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            setTimeout(function () { $(".mensajes").fadeOut(800).fadeIn(800).fadeOut(500).fadeIn(500).fadeOut(300); }, 3000);
        });
    </script>
    <!-- Estilos botones -->
    <link href="estilos/Botones/Modelo01/estilo.css" rel="stylesheet" type="text/css" />
         
</head>
<body id="bligoo-wrapper" >
    <form id="form1" runat="server">
        <div class="color-header-top " id="color-header-top"></div>
        <div class="color-header-bottom " id="color-header-bottom"></div>

        <div class="vbox-layout media-page-one-column-layout " id="layout-wrapper">
            <div class="vbox-layout explora-page-top  item-1 " id="explora-page-top">
                <div class="item-wrapper  item-1 ">
                    <div class="bligoo-block bligoo-block-large bligoo-block-image " id="bligoo-block-187">
                        <div class="bligoo-block-page bligoo-block-page-count-1 " id="bligoo-block-187-content">
                            <div class="logo-bligoo ">
                                <a href="Inicio.aspx"><img border="0" alt="Volver a la portada" title="Volver a la portada" src="img/Logo.jpg" /></a>
                            </div>
                        </div>
                        <div class="bligoo-block-page-2 bligoo-block-page-count-0 " style="display: none;"></div>
                        <div class="clear"></div>
                    </div>
                </div>

                <div class="item-wrapper  item-2 " >
                    <div class="bligoo-block bligoo-block-large bligoo-block-user-top-menu " id="bligoo-block-318">
                        <div class="bligoo-block-page bligoo-block-page-count-1 " id="bligoo-block-318-content">
                            <div class="clearfix " id="user-greeting-wrapper">
                                <div id="user-text-wrapper">
                                    <div class="clearfix " id="anonymous-text">
                                        <div class="clearfix " id="greeting-rightside">
                                            <div class="landing-action float-left "><a href="RegistrarUsuario.aspx">Registrarse si no tiene una 
                                                cuenta</a></div>
                                            <div class="float-left " id="anonymous-explora-landing-text"><strong>Nosotros te ayudaremos a mejorarlo cada día</strong> También puedes crear una  <a href="#">cuenta socio</a>, <a href="#">cuenta invitado</a> o <a href="Restaurantes.aspx" class="explora-link">explorar FacilitoOnline</a> »</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bligoo-block-page-2 bligoo-block-page-count-0 " style="display: none;"></div>
                        <div class="clear"></div>
                    </div>
                </div>

                <div class="clear"></div>
            </div>

            <div class="vbox-layout  item-2 " id="media-page-center"><div class="item-wrapper  item-1 "><h1>Ingresa tu 
                correo electrónico y contraseña</h1></div>
                <div class="item-wrapper  item-2 ">
                    <div id="login-form">
                        <div class="form-item-wrapper" id="form-item-wrapper-login-email">
                            <div class="failureNotification">
                                <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
                                <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
                                    ValidationGroup="loginUsuValidationGroup" CssClass="error"
                                    DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" />
                                <asp:Label ID="lblMensaje1" runat="server" CssClass="mensajes"></asp:Label>
                            </div>                                                
		                    <div class="form-item label-correoelectronico" id="form-item-login-email">
                                <span class="label">
                                <label for="login-email">Correo Electrónico</label></span><br />
                                <asp:TextBox ID="txtEmail" CssClass="password-field" runat="server"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                             ControlToValidate="txtEmail" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="Ingrese su Correo Electrónico." ToolTip="El Correo Electrónico es obligatorio." 
                                             ValidationGroup="loginUsuValidationGroup">*</asp:RequiredFieldValidator>
                            </div>
                        </div>

                        <div class="form-item-wrapper">
                            <div class="form-item label-contrasena"> 
                                <span class="label"><label>Contraseña</label></span><br />
                                <asp:TextBox ID="txtContraseña" CssClass="password-field" runat="server" 
                                    TextMode="Password"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                             ControlToValidate="txtContraseña" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="Ingrese su clave personal." ToolTip="La clave es obligatorio." 
                                             ValidationGroup="loginUsuValidationGroup">*</asp:RequiredFieldValidator>
                            </div>
                        </div>
                        
                        <asp:CheckBox ID="chkRecordar" CssClass="form-checkbox" runat="server" />
                        <label class="option">Recordarme en esta computadora</label><br class="page-break" /><br />

                        <asp:Button ID="btnIngresar" runat="server" 
                            CssClass="orange button" Text="Ingresar" Height="30px" 
                            Width="118px" onclick="btnIngresar_Click" 
                            ValidationGroup="loginUsuValidationGroup"/>&nbsp
                        <br class="page-break" /><br />
                        &nbsp;o&nbsp;<a class="register-link" href="RegistrarUsuario.aspx"> Regístrate</a> - <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>

                <div class="clear"></div>
            </div>

            <div class="vbox-layout  item-3 " id="media-page-footer">
                <div class="clear"></div>
            </div>
            <div class="clear"></div>
        </div>    
        
        <div class="bligoo-footer " id="bligoo-footer">
            <div class="bligoo-footer-wrapper " id="bligoo-footer-wrapper">
                <div class="bligoo-footer-container " id="bligoo-footer-container">
                    <div id="footer-up-links">
	                    <strong><a target="_BLANK" href="#">Sobre FacilitoOnline</a></strong> ·
	                    <strong><a target="_BLANK" href="#">Ayuda</a></strong> ·
	                    <strong><a target="_BLANK" href="#">Blog</a></strong> ·
	                    <strong><a target="_BLANK" href="#">Contacto</a></strong> ·
	                    <a target="_BLANK" href="#">Guía de convivencia</a> ·
	                    <a target="_BLANK" href="#">Políticas de privacidad</a> ·
	                    <a target="_BLANK" href="#">Términos de uso</a> ·
	                    <a target="_BLANK" href="#">Preguntas frecuentes</a>
                    </div>
                    <div id="footer-down-links">
	                    © 2012 FacilitoOnline ·
	                    <a href="#">English</a> ·
	                    <a href="#">Português</a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
