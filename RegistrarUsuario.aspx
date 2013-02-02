<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RegistrarUsuario.aspx.cs" Inherits="Registrar" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Registrar Empresa</title>
    <link href="estilos/Dashboard/stylesheet.css" rel="stylesheet" type="text/css" />
    <link href="estilos/Dashboard/bligoo-dashboard.css" rel="stylesheet" type="text/css" />
    <script src="estilos/Dashboard/logged.js" type="text/javascript"></script>
    <link href="estilos/Botones/Modelo01/estilo.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="bligoo-dashboard-wrapper"><div class="color-header-top " id="color-header-top"></div>
            <div id="bligoo-dashboard-innercontent">
                <div id="dashboard-header-wrapper">
                    <!-- LOGO -->
                    <div class="clearfix " id="dashboard-header-top">
                        <div class="float-left " id="bligoo-dashboard-logo"><img border="0" alt="" src="img/Logo.jpg" /></div>
                    </div>
                    <!-- MENÚ -->
                    <div class="clearfix " id="user-greeting-wrapper">
                        <div id="user-text-wrapper">
                            <div class="clearfix" id="user-text2">
                                Al registrarte gratuitamente en FACILITO Online, podrás aparecer en el listado de proveedores de tus productos más importantes. Para que los usuarios que visitan nuestro portal puedan contactarte fácilmente, es importante que tus datos estén completos. Si quieres saber otros beneficios de nuestro portal <a href="#">visita este enlace</a>.
                                Nota: Los campos marcados con asterisco son obligatorios (*)
                                <a href="Restaurantes.aspx">Explorar FacilitoOnline.com</a></div>
                        </div>
                    </div>
                    
                    <br />
                        <span class="failureNotification"><asp:Literal ID="FailureText" runat="server"></asp:Literal></span>
                        <asp:ValidationSummary ID="RegistrarEmpValidationSummary" runat="server" 
                        CssClass="failureNotification" ValidationGroup="RegistrarUsuValidationGroup" 
                        BackColor="#E0ECF8"/>
                    <br />

                    <div class="divfiels">
                        <!-- El control con el id. 'UpdatePanel1' requiere un ScriptManager en la página. ScriptManager debe aparecer antes que los controles que lo requieren.-->
                        <asp:ScriptManager ID="ScriptManager1" runat="server" />
                        <fieldset class="login">
                            <legend>Datos de Contacto</legend>
                            <table style="width: 100%;">
                                <tr>
                                    <td width="33%">Nombres <span class="failureNotification">*</span></td>
                                    <td width="33%">Apellidos <span class="failureNotification">*</span></td>
                                    <td width="34%">Correo Electrónico <span class="failureNotification">*</span></td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtNombres" runat="server" Width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                             ControlToValidate="txtNombres" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El nombre de usuario es obligatorio." ToolTip="El nombre de usuario es obligatorio." 
                                             ValidationGroup="RegistrarUsuValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="33%">
                                        <asp:TextBox ID="txtApellidos" runat="server" Width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                             ControlToValidate="txtApellidos" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El apellido de usuario es obligatorio." ToolTip="El apellido de usuario es obligatorio." 
                                             ValidationGroup="RegistrarUsuValidationGroup">*</asp:RequiredFieldValidator>    
                                    </td>
                                    <td width="34%">
                                        <asp:TextBox ID="txtEmail" runat="server" Width="240px" CssClass="campo-field"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="33%">Fecha de Nacimiento</td>
                                    <td width="33%">Dirección</td>
                                    <td width="34%">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtFechaDeNacimiento" runat="server" Width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td width="33%">
                                        <asp:TextBox ID="txtDireccion" runat="server" Width="240px" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td width="34%">
                                        <asp:DropDownList ID="cboTipoCliente" runat="server" Width="150px" 
                                            Enabled="False" Visible="False" CssClass="campo-field"></asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="33%">Contraseña <span class="failureNotification">*</span></td>
                                    <td width="33%">
                                        &nbsp;</td>
                                    <td width="34%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtClave" runat="server" TextMode="Password" width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                             ControlToValidate="txtClave" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="La contraseña es obligatorio." ToolTip="La contraseña es obligatorio." 
                                             ValidationGroup="RegistrarUsuValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="33%">
                                        &nbsp;</td>
                                    <td width="34%">
                                        &nbsp;</td>
                                </tr>
                            </table>
                        </fieldset>
                        <!-- UpdatePanel -->
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <div>
                                    <asp:Button ID="btnRegistrar" runat="server" CommandName="Login" 
                                        ValidationGroup="RegistrarUsuValidationGroup" onclick="btnRegistrar_Click"
                                        ToolTip="Registrar" Height="30px" Width="118px" 
                                        Text="Registrar" CssClass="orange button" />
                                </div>
                                <div align="center">
                                    <asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
                                </div>
                            </ContentTemplate>
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="btnRegistrar" EventName="Click" />
                            </Triggers>
                        </asp:UpdatePanel><br />
                        <!-- UpdateProgress -->
                        <asp:UpdateProgress ID="UpdateProgress1" runat="server">
                            <ProgressTemplate>
                                <img alt="" src="img/iconos/cargar.gif" />
                                Actualizando Página ......
                            </ProgressTemplate>
                        </asp:UpdateProgress>
                    </div>
                </div>
            </div>

            <!--PIE DE PAGINA-->
            <div id="dashboard-footer-wrapper">
                <div id="dashboard-footer">
                    <div class="clearfix " id="dashboard-footer-inner">
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
        </div>

        <!-- Cargar dashboard -->
        <script type="text/javascript">
            $('bligoo-dashboard-wrapper').fire('dashboard:loaded');
        </script>
        <script type="text/javascript">
            saveHit('dashboard', 0, '', 0);
        </script>
    </form>
</body>
</html>
