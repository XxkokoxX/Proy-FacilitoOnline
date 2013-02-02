<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ActualizarDatosVisitante.aspx.cs" Inherits="MantenimientoVisitante" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
<div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Actualizar datos del Visitante</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/buscar.png" />
                            <asp:Button ID="btnActualizar" runat="server" Text="Actualizar"
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para actualizar sus datos personales." 
                                onclick="btnActualizar_Click" CssClass="yellow button" ValidationGroup="ActDatosValidationGroup" />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Modifique los siguientes datos:</b></td>
                                    <td width="25%">&nbsp;</td>
                                    <td width="15%" rowspan="6" align="center">
                                        <asp:LoginName ID="HeadLoginName" runat="server" />
                                        <asp:HiddenField ID="HiddenField1" runat="server" />
                                        <asp:HiddenField ID="HiddenField2" runat="server" />
                                    </td>
                                    <td width="30%">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b></b></td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Nombre:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtNombre" runat="server" Width="200px" CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td width="20%">
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtNombre" ErrorMessage="Ingrese su nombre." 
                                            ToolTip="El nombre es obligatorio." ValidationGroup="ActDatosValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Apellidos:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtApellido" runat="server" Width="200px" CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" 
                                            ControlToValidate="txtApellido" ErrorMessage="Ingrese sus apellidos." 
                                            ToolTip="El apellido es obligatorio." ValidationGroup="ActDatosValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Dirección:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtDireccion" runat="server" Width="200px" CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" 
                                            ControlToValidate="txtDireccion" ErrorMessage="Ingrese su dirección completa." 
                                            ToolTip="La dirección es obligatoria." ValidationGroup="ActDatosValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Fecha de Nacimiento</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFecNac" runat="server" Width="200px" CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" 
                                            ControlToValidate="txtFecNac" ErrorMessage="Ingrese su fecha de nacimiento." 
                                            ToolTip="La fecha de nacimiento es obligatoria." ValidationGroup="ActDatosValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="5"><b><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></b>
                                        <b><asp:CompareValidator ID="CompareValidator1" runat="server" ControlToValidate="txtFecNac" 
                                        ErrorMessage="Error de formato. Usted debe ingresar dd/mm/yyyy" Operator="DataTypeCheck" Type="Date" CssClass="failureNotification" ValidationGroup="ActDatosValidationGroup"> </asp:CompareValidator></b>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/limpiar.png" alt="" />
                            <asp:Button ID="btnLimpiar" runat="server" Text="Limpiar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para limpiar los controles." 
                                onclick="btnLimpiar_Click" CssClass="yellow button" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/salir.png" />
                            <asp:Button ID="Button2" runat="server" ForeColor="#FF3300" 
                                PostBackUrl="~/PanelInicio.aspx" Text="Regresar" 
                                ToolTip="Click aquí para cancelar." Width="100px" 
                                CssClass="yellow button" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div><br />

    <div class="line"></div><br />
    
    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="ActDatosValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div><br />
</asp:Content>

