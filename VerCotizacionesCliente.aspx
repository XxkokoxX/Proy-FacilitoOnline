<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="VerCotizacionesCliente.aspx.cs" Inherits="VerCotizacionesCliente" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
<div class="article">
    <table style="width:100%;" class="ic_container">
        <tr>
            <td align="center"><h3><b>Detalle de Cotizaciones recibidas</b></h3></td>
        </tr>
        <tr style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
            <asp:GridView ID="gridDetalleCotizacion" runat="server" AutoGenerateColumns="False"
                BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px"
                onselectedindexchanged="gridDetalleCotizacion_SelectedIndexChanged"
                ForeColor="Black" GridLines="Vertical" Width="100%" 
                EmptyDataText="No hay cotizaciones">
                <AlternatingRowStyle BackColor="White" />
                <Columns>
                    <asp:CommandField HeaderText="Seleccionar" ShowSelectButton="true"
                        ButtonType="Image" SelectImageUrl="~/img/iconos/fle.png">
                        <ItemStyle HorizontalAlign="Center" /></asp:CommandField>
                        <asp:BoundField DataField="id" HeaderText="Id" />
                        <asp:BoundField DataField="email" HeaderText="Email Solicitante" />
                        <asp:BoundField DataField="apellidos" HeaderText="Apellidos Solicitante" />
                        <asp:BoundField DataField="nombres" HeaderText="Nombres Solicitante" />
                        <asp:BoundField DataField="direccion" HeaderText="Dirección Solicitante" />
                        <asp:BoundField DataField="nro_personas" HeaderText="Nro de Personas a cotizar" />
                        <asp:BoundField DataField="fecha_solicitud" HeaderText="Fecha a cotizar" />
                        <asp:BoundField DataField="mot_usuario" HeaderText="Motivo" />
                </Columns>
                <FooterStyle BackColor="#CCCC99" />
                <HeaderStyle BackColor="#6B696B" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="#F7F7DE" ForeColor="Black" HorizontalAlign="Right" />
                <RowStyle BackColor="#F7F7DE" />
                <SelectedRowStyle BackColor="#CE5D5A" Font-Bold="True" ForeColor="White" />
                <SortedAscendingCellStyle BackColor="#FBFBF2" />
                <SortedAscendingHeaderStyle BackColor="#848384" />
                <SortedDescendingCellStyle BackColor="#EAEAD3" />
                <SortedDescendingHeaderStyle BackColor="#575357" />
                </asp:GridView>                
        </tr>
        <tr>
            <td><br /></td>
            <td></td>
        </tr>
        <tr>
            <td>
                <asp:TextBox ID="txtRespuesta" runat="server" Width="840px" Height="80px"></asp:TextBox>
            </td>
            <td>
                <asp:Button ID="btnAceptar" runat="server" Text="Aceptar" onclick="btnAceptar_Click"/>   
                <asp:HiddenField ID="hdfId" runat="server" />      
            </td>
        </tr>
    </table>
</div>
</asp:Content>

