<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="EnviarFacturaMensual.aspx.cs" Inherits="EnviarVariosCorreos" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Enviar Comprobante de Pago Mensual</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; ">
                            <img alt="" src="img/iconos/correo.png" style="width: 165px; height: 200px"/></td>
                        <td align="center">
                            <h3><asp:Label ID="lblFechaEnvio" runat="server"></asp:Label></h3><br /><br />
                            <asp:Button ID="btnEnviarATodos" runat="server" onclick="btnEnviarATodos_Click" 
                                Text="Enviar a todos" CssClass="yellow button" Width="400px" /><br />
                            <b>Lista de Correos: </b><asp:DropDownList ID="cboListaDeCorreos" runat="server" Width="200px">
                            </asp:DropDownList><br />
                            <b><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div><br />
</asp:Content>

