<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ActualizarDatosEmpresa.aspx.cs" Inherits="ActualizarDatosEmpresa" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="divfiels">
                        <!-- El control con el id. 'UpdatePanel1' requiere un ScriptManager en la página. ScriptManager debe aparecer antes que los controles que lo requieren.-->
                        <asp:ScriptManager ID="ScriptManager1" runat="server" />
        <fieldset class="login">
            <legend>Datos de Contacto</legend>
            <table style="width: 100%;">
                <tr>
                    <td width="33%">
                        Nombre Completo <span class="failureNotification">*</span></td>
                    <td width="33%">
                        Email <span class="failureNotification">*</span></td>
                    <td width="34%">
                        Cargo dentro de la organización <span class="failureNotification">*</span></td>
                </tr>
                <tr>
                    <td width="33%">
                        <asp:TextBox ID="txtContacto" runat="server" Width="240px" 
                            CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                             ControlToValidate="txtContacto" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El nombre del contacto es obligatorio." ToolTip="El nombre del contacto es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="33%">
                        <asp:TextBox ID="txtEmail" runat="server" Width="200px" CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                             ControlToValidate="txtEmail" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El email del contacto es obligatorio." ToolTip="El email del contacto es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="34%">
                        <asp:DropDownList ID="cboCargo" runat="server" Width="150px" 
                            CssClass="campo-field">
                        </asp:DropDownList>
                    </td>
                </tr>
            </table>
        </fieldset>
        <br />
        <fieldset class="login">
            <legend>Información de la Empresa</legend>
            <table style="width: 100%;">
                <tr>
                    <td colspan="3">
                        Razón Social <span class="failureNotification">*</span></td>
                </tr>
                <tr>
                    <td colspan="3">
                        <asp:TextBox ID="txtRazonSocial" runat="server" Width="85%" 
                            CssClass="campo-field"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td width="33%">
                        Calle <span class="failureNotification">*</span></td>
                    <td width="33%">
                        Número Exterior <span class="failureNotification">*</span></td>
                    <td width="34%">
                        Número Interior</td>
                </tr>
                <tr>
                    <td width="33%">
                        <asp:TextBox ID="txtCalle" runat="server" Width="240px" CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                             ControlToValidate="txtCalle" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="La calle es obligatoria." ToolTip="El calle es obligatoria." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="33%">
                        <asp:TextBox ID="txtNumeroExterior" runat="server" CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                             ControlToValidate="txtNumeroExterior" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El número exterior es obligatorio." ToolTip="El número exterior es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="34%">
                        <asp:TextBox ID="txtNumeroInterior" runat="server" CssClass="campo-field"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td width="33%">
                        Colonia - Deleg. - Municipio <span class="failureNotification">*</span></td>
                    <td width="33%">
                        CP <span class="failureNotification">*</span></td>
                    <td width="34%">
                        Ciudad <span class="failureNotification">*</span></td>
                </tr>
                <tr>
                    <td width="33%">
                        <asp:TextBox ID="txtMunicipio" runat="server" Width="240px" 
                            CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" 
                                             ControlToValidate="txtMunicipio" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El municipio es obligatorio." ToolTip="El número municipio es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="33%">
                        <asp:TextBox ID="txtCodigoPostal" runat="server" CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                             ControlToValidate="txtCodigoPostal" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="El código postal es obligatorio." ToolTip="El código postal es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                    <td width="34%">
                        <asp:TextBox ID="txtCiudad" runat="server" CssClass="campo-field"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" 
                                             ControlToValidate="txtCiudad" 
                                             CssClass="failureNotification" 
                                             ErrorMessage="La ciudad es obligatorio." ToolTip="La ciudad es obligatorio." 
                                             ValidationGroup="RegistrarEmpValidationGroup">*</asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr>
                    <td width="33%">
                        País <span class="failureNotification">*</span></td>
                    <td width="33%">
                        Estado <span class="failureNotification">*</span></td>
                    <td width="34%">
                        &nbsp;</td>
                </tr>
                <tr>
                    <td width="33%">
                        <asp:DropDownList ID="cboPais" runat="server" AutoPostBack="True" 
                                            onselectedindexchanged="cboPais_SelectedIndexChanged" 
                            Width="150px" CssClass="campo-field">
                        </asp:DropDownList>
                    </td>
                    <td width="33%">
                        <asp:DropDownList ID="cboEstado" runat="server" Width="150px" 
                            CssClass="campo-field">
                            <asp:ListItem>---Seleccione---</asp:ListItem>
                        </asp:DropDownList>
                    </td>
                    <td width="34%">
                        <asp:DropDownList ID="cboTipoCliente" runat="server" Width="150px" 
                                            Enabled="False" Visible="False" CssClass="campo-field">
                        </asp:DropDownList>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        Sitio Web</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <asp:TextBox ID="txtSitioWeb" runat="server" Width="40%" CssClass="campo-field">http://</asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        Actividad Preponderante</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <asp:TextBox ID="txtActividadPreponderante" runat="server" Height="120px" TextMode="MultiLine" 
                                            Width="80%" CssClass="campo-field"></asp:TextBox>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        Listado de Productos / Servicios que ofrece 
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <asp:TextBox ID="txtListarProductos" runat="server" Height="120px" TextMode="MultiLine" 
                                            Width="80%" CssClass="campo-field"></asp:TextBox>
                    </td>
                </tr>
            </table>
        </fieldset>
        <br />
        &nbsp;<!-- UpdatePanel --><asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <div>
                                    <asp:Button ID="btnRegistrar" runat="server" CommandName="Login" 
                                        ValidationGroup="RegistrarEmpValidationGroup" onclick="btnRegistrar_Click"
                                        ToolTip="Grabar cambios" Height="30px" Width="118px"
                                        Text="Grabar" CssClass="orange button" />
                                    &nbsp;
                                </div>
                                <div align="center">
                                    <asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
                                </div>
                            </ContentTemplate>
                            <Triggers>
                                <asp:AsyncPostBackTrigger ControlID="btnRegistrar" EventName="Click" />
                            </Triggers>
        </asp:UpdatePanel>
        <br />
                        <!-- UpdateProgress -->
                        <asp:UpdateProgress ID="UpdateProgress1" runat="server">
                            <ProgressTemplate>
                                <img alt="" src="img/iconos/cargar.gif" />
                                Actualizando Pagina ......
                            </ProgressTemplate>
        </asp:UpdateProgress>
    </div>
</asp:Content>

