<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="CotizacionesRecibidas.aspx.cs" Inherits="CotizacionesRecibidas" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="article">
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Cotizaciones Recibidas</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                                        AllowPaging="True"  
                                        Width="100%" 
                                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                                        CellPadding="4" ForeColor="Black" GridLines="Vertical" 
                                        PageSize="5" 
                        EmptyDataText="No hay cotizaciones respondidas" >
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:boundfield datafield="id" headertext="Id">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
                            <asp:boundfield datafield="mot_usuario" headertext="Motivo">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
                            <asp:boundfield datafield="nro_personas" headertext="Numero Personas" DataFormatString="{0:d}">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
                            <asp:BoundField DataField="usuario" HeaderText="Usuario" DataFormatString="{0:d}">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
                            <asp:boundfield datafield="resp_cliente" headertext="Respuesta" DataFormatString="{0:d}">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
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

