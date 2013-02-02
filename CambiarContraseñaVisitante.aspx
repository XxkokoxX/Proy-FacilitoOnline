<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="CambiarContraseñaVisitante.aspx.cs" Inherits="CambiarContraseñaVisitante" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Cambiar Contraseña</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/buscar.png" />
                            <asp:Button ID="btnActualizar" runat="server" Text="Actualizar"
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para actualizar su contraseña." 
                                onclick="btnActualizar_Click" CssClass="yellow button" ValidationGroup="ActContraValidationGroup"  />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Ingrese los siguientes datos:</b></td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="20%" rowspan="6" align="center">
                                        <img alt="" src="img/iconos/candado.png" style="width: 98px; height: 113px" /></td>
                                    <td width="35%">
                                        &nbsp;</td>
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
                                    <td style="width: 156px"><b>Contraseña Anterior</b></td>
                                    <td>
                                        <asp:TextBox ID="txtClave" runat="server" CssClass="campo-field" 
                                            Width="200px" TextMode="Password"></asp:TextBox>
                                    </td>
                                    <td width="20%">
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtClave" ErrorMessage="Ingrese su contraseña." 
                                            ToolTip="La contraseña actual es obligatoria." ValidationGroup="ActContraValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Nueva Contraseña:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtNuevaClave" runat="server" Width="200px" 
                                            CssClass="campo-field" TextMode="Password"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" 
                                            ControlToValidate="txtNuevaClave" ErrorMessage="Ingrese su nueva contraseña." 
                                            ToolTip="El nueva contraseña es obligatoria." ValidationGroup="ActContraValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px"><b>Confirmar Contraseña:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtConfirmacion" runat="server" Width="200px" 
                                            CssClass="campo-field" TextMode="Password"></asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" 
                                            ControlToValidate="txtConfirmacion" ErrorMessage="Confirme su nueva contraseña." 
                                            ToolTip="La confirmación de la contraseña es obligatoria." ValidationGroup="ActContraValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="width: 156px">&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="5"><b><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></b></td>
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
            ValidationGroup="ActContraValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div><br />
</asp:Content>

