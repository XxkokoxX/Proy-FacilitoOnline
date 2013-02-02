<%@ Page Title="" Language="C#" MasterPageFile="~/Principal.master" AutoEventWireup="true" CodeFile="ValidarCuenta.aspx.cs" Inherits="ValidarCuenta" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table style="width: 100%;" class="exito">
        <tr>
            <td align="center" style="width: 302px; 20%: ;" rowspan="5">
                <img alt="" src="img/iconos/activar.png" style="width: 225px; height: 122px" /></td>
            <td align="center"> <h4>ACTIVA TU CUENTA</h4></td>
            <td align="center" width="20%">
                &nbsp;</td>
        </tr>
        <tr>
            <td align="center">
                Ingresa tu usuario:</td>
            <td align="center" rowspan="3">
                <span class="failureNotification">
                <asp:Literal ID="FailureText" runat="server"></asp:Literal>
                </span>
                <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
                    CssClass="failureNotification" ValidationGroup="ValidarCuenta" />
            </td>
        </tr>
        <tr>
            <td align="center">
                <asp:TextBox ID="txtUsuario" runat="server" Width="250px"></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                    ControlToValidate="txtUsuario" CssClass="failureNotification" 
                    ErrorMessage="Ingrese el Usuario generado para validar la cuenta" 
                    ToolTip="Ingrese el Usuario generado para validar la cuenta" 
                    ValidationGroup="ValidarCuenta">*</asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td align="center">
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
            <td align="center">
                <asp:Button ID="btnValidar" runat="server" CssClass="orange button" 
                    onclick="btnValidar_Click" Text="Validar" ValidationGroup="ValidarCuenta" />
            </td>
            <td align="center">
                &nbsp;</td>
        </tr>
        </table>
</asp:Content>

