<%@ Page Language="C#" AutoEventWireup="true" CodeFile="RegistrarEmpresa.aspx.cs" Inherits="Registrar" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Registrar Empresa</title>
    <link href="estilos/Dashboard/stylesheet.css" rel="stylesheet" type="text/css" />
    <link href="estilos/Dashboard/bligoo-dashboard.css" rel="stylesheet" type="text/css" />
    <script src="estilos/Dashboard/logged.js" type="text/javascript"></script>
    <!-- script para google map-->
    <script  type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" >
        var geocoder;
        var map;
        function initialize() {

            geocoder = new google.maps.Geocoder();

            var latlng = new google.maps.LatLng(-12.122294023071484, -77.02840379999998);

            var mapOptions = {
                zoom: 15,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        }

        function codeAddress() {
            var address = document.getElementById("txtCalle").value.trim()+" " + document.getElementById("txtMunicipio").value.trim();
            var dpto = document.getElementById("cboEstado");
            var pais = document.getElementById("cboPais");
           
            address = address +" " + dpto.options[dpto.selectedIndex].text + " " + pais.options[pais.selectedIndex].text;
            
            geocoder.geocode({ "address": address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("La Gelocalizacion no fue exitosa, estatus: " + status);
                }
            });
        }
    </script>
</head>
<body onload="initialize()">
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
                            </div>
                        </div>
                    </div>
                    
                    <br />
                        <span class="failureNotification"><asp:Literal ID="FailureText" runat="server"></asp:Literal></span>
                        <asp:ValidationSummary ID="RegistrarEmpValidationSummary" runat="server" 
                        CssClass="failureNotification" ValidationGroup="RegistrarEmpValidationGroup" 
                        BackColor="#E0ECF8"/>
                    <br />

                    <div class="divfiels">
                        <!-- El control con el id. 'UpdatePanel1' requiere un ScriptManager en la página. ScriptManager debe aparecer antes que los controles que lo requieren.-->
                        <asp:ScriptManager ID="ScriptManager1" runat="server" />
                        <fieldset class="login">
                            <legend>Datos de Contacto</legend>
                            <table style="width: 100%;">
                                <tr>
                                    <td width="33%">Nombre Completo <span class="failureNotification">*</span></td>
                                    <td width="33%">Email <span class="failureNotification">*</span></td>
                                    <td width="34%">Cargo dentro de la organización <span class="failureNotification">*</span></td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtContacto" runat="server" Width="240px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                             ControlToValidate="txtContacto" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El nombre del contacto es obligatorio." ToolTip="El nombre del contacto es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="33%">
                                        <asp:TextBox ID="txtEmail" runat="server" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                             ControlToValidate="txtEmail" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El email del contacto es obligatorio." ToolTip="El email del contacto es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>    
                                    </td>
                                    <td width="34%">
                                        <asp:DropDownList ID="cboCargo" runat="server" Width="150px"></asp:DropDownList>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>
                        <br />
                        <fieldset class="login">
                            <legend>Información de la Empresa</legend>
                            <table style="width: 100%;">
                                <tr>
                                    <td colspan="3">Razón Social <span class="failureNotification">*</span></td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <asp:TextBox ID="txtRazonSocial" runat="server" Width="85%"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="33%">Calle <span class="failureNotification">*</span></td>
                                    <td width="33%">Número Exterior <span class="failureNotification">*</span></td>
                                    <td width="34%">Número Interior</td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtCalle" runat="server" Width="240px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                             ControlToValidate="txtCalle" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="La calle es obligatoria." ToolTip="El calle es obligatoria." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="33%">
                                        <asp:TextBox ID="txtNumeroExterior" runat="server"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                             ControlToValidate="txtNumeroExterior" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El número exterior es obligatorio." ToolTip="El número exterior es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="34%">
                                        <asp:TextBox ID="txtNumeroInterior" runat="server"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="33%">Colonia - Deleg. - Municipio <span class="failureNotification">*</span></td>
                                    <td width="33%">CP <span class="failureNotification">*</span></td>
                                    <td width="34%">Ciudad <span class="failureNotification">*</span></td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:TextBox ID="txtMunicipio" runat="server" Width="240px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" 
                                             ControlToValidate="txtMunicipio" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El municipio es obligatorio." ToolTip="El número municipio es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="33%">
                                        <asp:TextBox ID="txtCodigoPostal" runat="server"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                             ControlToValidate="txtCodigoPostal" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El código postal es obligatorio." ToolTip="El código postal es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                    <td width="34%">
                                        <asp:TextBox ID="txtCiudad" runat="server"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" 
                                             ControlToValidate="txtCiudad" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="La ciudad es obligatorio." ToolTip="La ciudad es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="33%">País <span class="failureNotification">*</span></td>
                                    <td width="33%">Estado <span class="failureNotification">*</span></td>
                                    <td width="34%">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="33%">
                                        <asp:DropDownList ID="cboPais" runat="server" AutoPostBack="True" 
                                            onselectedindexchanged="cboPais_SelectedIndexChanged" Width="150px">
                                        </asp:DropDownList>
                                    </td>
                                    <td width="33%">
                                        <asp:DropDownList ID="cboEstado" runat="server" Width="150px">
                                            <asp:ListItem>---Seleccione---</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                    <td width="34%">
                                        <asp:DropDownList ID="cboTipoCliente" runat="server" Width="150px" 
                                            Enabled="False" Visible="False"></asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">Sitio Web</td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <asp:TextBox ID="txtSitioWeb" runat="server" Width="40%">http://</asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">Actividad Preponderante</td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <asp:TextBox ID="txtActividadPreponderante" runat="server" Height="120px" TextMode="MultiLine" 
                                            Width="80%"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3">Listado de Productos / Servicios que ofrece </td>
                                </tr>
                                <tr>
                                    <td colspan="3">
                                        <asp:TextBox ID="txtListarProductos" runat="server" Height="120px" TextMode="MultiLine" 
                                            Width="80%"></asp:TextBox>
                                    </td>
                                </tr>
                            </table>
                        </fieldset>
                        <br />
                        <fieldset class="login">
                            <legend>Ubicación Geográfica </legend>
                            <input type="button" value="Localizar" onclick="codeAddress();">
                            <div id="map_canvas" style="height:300px;width:100%"></div>
                        </fieldset>
                        <!-- UpdatePanel -->
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <div>
                                    <asp:Button ID="btnRegistrar" runat="server" CommandName="Login" 
                                        ValidationGroup="RegistrarEmpValidationGroup" onclick="btnRegistrar_Click"
                                        ToolTip="Registrar" Height="30px" Width="118px"
                                        Text="Registrar" />&nbsp;
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
                                Actualizando Pagina ......
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
