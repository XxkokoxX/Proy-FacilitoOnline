<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="CambiarCuentaVisitanteASocio.aspx.cs" Inherits="MantenimientoVisitante" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Cambiar Cuenta Invitado a Socio</b></h2>
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/guardar.png" alt=""/>
                            <asp:Button ID="btnGrabar" 
                                runat="server" Text="Grabar" onclick="btnGrabar_Click" Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para grabar." 
                                ValidationGroup="RegUserValidationGroup" CssClass="yellow button" />
                        </td>
                        <td rowspan="4">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Membresia:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtMembresia" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                    </td>
                                    <td width="20%"><b>Tipo de Cuenta</b></td>
                                    <td width="35%">
                                        <asp:DropDownList ID="cboTipoCuenta" runat="server" Width="153px" 
                                            Enabled="False">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Razón Social:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtRazonSocial" runat="server" Enabled="False" Width="200px" ></asp:TextBox>
                                    </td>
                                    <td><b>Fecha de Registro:</b></td>
                                    <td>
                                        <asp:Label ID="lblFechaRegistro" runat="server"></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Contacto:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtContacto" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="2"><b>Ingrese los siguientes datos:</b></td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Clave:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtClave" runat="server" TextMode="Password"></asp:TextBox>
                                    </td>
                                    <td colspan="2"></td>
                                </tr>
                                <tr>
                                    <td><b>Confirmar clave:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtConfirmacion" runat="server" TextMode="Password"></asp:TextBox>
                                    </td>
                                    <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <asp:DropDownList ID="cboTipoCuenta2" runat="server" Width="153px">
                                            <asp:ListItem Value="2">Socio</asp:ListItem>
                                        </asp:DropDownList>
                                    </td>
                                    <td colspan="2">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="4"><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="Button2" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelInvitado.aspx" CssClass="yellow button" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="line"></div>        
</asp:Content>

