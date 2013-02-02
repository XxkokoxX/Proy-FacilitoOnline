<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ConsultarClienteMasVisitados.aspx.cs" Inherits="ReporteOfertas" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Clientes mas Visitados</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/buscar.png" />
                            <asp:Button ID="btnConsultar" runat="server" Text="Buscar"
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para listar comentarios." 
                                onclick="btnBuscar_Click" CssClass="yellow button"  />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Seleciona Cliente</b></td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Cliente</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboCliente" runat="server">
                                        </asp:DropDownList>
                                    </td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
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
                            <img alt="" src="img/iconos/salir.png" />
                            <asp:Button ID="Button1" runat="server" ForeColor="#FF3300" 
                                PostBackUrl="~/PanelAdministrador.aspx" Text="Regresar" 
                                ToolTip="Click aquí para cancelar." Width="100px" 
                                CssClass="yellow button" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div><br />

    <div class="line"></div><br />   
        
    <div class="article">
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Clientes más Visitados</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" Width="100%" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                   
                            <asp:boundfield datafield="razonSocial" headertext="Empresa">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:boundfield datafield="nombreContacto" headertext="Contacto">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="tipoCliente" HeaderText="Tipo de Cliente" >
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:BoundField DataField="ciudad" HeaderText="Distrito" >
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:BoundField HeaderText="Nro de visitas" DataField="cantidad" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle BackColor="#CCCC00" />
                            </asp:BoundField>
                        </Columns>
                        <FooterStyle BackColor="#CCCC99" />
                        <HeaderStyle BackColor="#6B696B" Font-Bold="True" ForeColor="White" />
                        <PagerStyle BackColor="#F7F7DE" ForeColor="Black" HorizontalAlign="Right" />
                        <RowStyle HorizontalAlign="Center" BackColor="#F7F7DE" />
                        <SelectedRowStyle BackColor="#CE5D5A" Font-Bold="True" ForeColor="White" />
                        <SortedAscendingCellStyle BackColor="#FBFBF2" />
                        <SortedAscendingHeaderStyle BackColor="#848384" />
                        <SortedDescendingCellStyle BackColor="#EAEAD3" />
                        <SortedDescendingHeaderStyle BackColor="#575357" />
                    </asp:GridView>
                </td>
            </tr>
        </table>
    </div>
</asp:Content>

