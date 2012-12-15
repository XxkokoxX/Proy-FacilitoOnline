<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ValidarCuenta.aspx.cs" Inherits="ValidarCliente" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="estilos/Dashboard/stylesheet.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <table style="width: 100%;">
            <tr>
                <td align="center" colspan="3">ACTIVA TU CUENTA</td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    Ingresa tu usuario:</td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    <asp:TextBox ID="txtUsuario" runat="server"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                        ControlToValidate="txtUsuario" 
                        ErrorMessage="Ingrese el Usuario generado para validar la cuenta" ToolTip="Ingrese el Usuario generado para validar la cuenta" 
                        ValidationGroup="ValidarCuenta" CssClass="failureNotification">*</asp:RequiredFieldValidator>
                </td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    <asp:CheckBox ID="chkActivo" runat="server" Checked="True" Text="Activo" 
                        Visible="False" />
                    <asp:CheckBox ID="chkAdministrador" runat="server" Text="Administrador" 
                        Visible="False" />
                    <asp:CheckBox ID="chkVisitante" runat="server" Text="Visitante" 
                        Visible="False" />
                    <asp:CheckBox ID="chkSocio" runat="server" Text="Cliente Socio" 
                        Visible="False" />
                    <asp:CheckBox ID="chkInvitado" runat="server" Checked="True" 
                        Text="Cliente Invitado" Visible="False" />
                </td>
            </tr>
            <tr>
                <td align="center" width="30%">
                    &nbsp;</td>
                <td align="center">
                    <span class="failureNotification"><asp:Literal ID="FailureText" runat="server"></asp:Literal></span>
                    <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
                        CssClass="failureNotification" ValidationGroup="ValidarCuenta" />
                </td>
                <td align="center" width="30%">
                    &nbsp;</td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    <asp:Button ID="btnValidar" runat="server" onclick="btnValidar_Click" 
                        Text="Validar" ValidationGroup="ValidarCuenta" />
                </td>
            </tr>
        </table>
    
    </div>
    </form>
</body>
</html>
