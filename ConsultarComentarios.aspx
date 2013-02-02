<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ConsultarComentarios.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Consultar Comentarios</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/buscar.png" />
                            <asp:Button ID="btnBuscar" runat="server" Text="Buscar"
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para listar comentarios." 
                                onclick="btnBuscar_Click" CssClass="yellow button"  />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Listar por rango de fechas</b></td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha Inicio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaInicio" runat="server" Width="200px" 
                                            CssClass="campo-field" ></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha Fin:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaFin" runat="server" Width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
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
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
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
        
    <div class="article">
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Consultar Comentarios</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" Width="100%" onrowdatabound="GridView1_RowDataBound" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" >
                   
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                   
                            <asp:boundfield datafield="nombreCompleto" headertext="Usuario">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:boundfield datafield="email" headertext="Email">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:TemplateField HeaderText="Comentarios">
                                <ItemTemplate>
                                    <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False" 
                                        CellPadding="4" ForeColor="#333333" GridLines="None" Width="100%">
                                        <AlternatingRowStyle BackColor="White" />
                                        <Columns>
                                            <asp:CommandField ButtonType="Image" SelectImageUrl="~/img/iconos/fle.png" 
                                                ShowSelectButton="True" />
                                            <asp:BoundField DataField="fecha" HeaderText="Fecha">
                                            <ItemStyle Width="100px" />
                                            </asp:BoundField>
                                            <asp:BoundField DataField="comentario" 
                                                HeaderText="Comentarios hechos por este usuario" />
                                            <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                                ShowDeleteButton="True" />
                                        </Columns>
                                        <FooterStyle BackColor="#990000" Font-Bold="True" ForeColor="White" />
                                        <HeaderStyle BackColor="#990000" Font-Bold="True" ForeColor="White" />
                                        <PagerStyle BackColor="#FFCC66" ForeColor="#333333" HorizontalAlign="Center" />
                                        <RowStyle BackColor="#FFFBD6" ForeColor="#333333" />
                                        <SelectedRowStyle BackColor="#FFCC66" Font-Bold="True" ForeColor="Navy" />
                                        <SortedAscendingCellStyle BackColor="#FDF5AC" />
                                        <SortedAscendingHeaderStyle BackColor="#4D0000" />
                                        <SortedDescendingCellStyle BackColor="#FCF6C0" />
                                        <SortedDescendingHeaderStyle BackColor="#820000" />
                                    </asp:GridView>
                                </ItemTemplate>
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:TemplateField>

                            <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                ShowDeleteButton="True" HeaderText="Eliminar" >
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
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

