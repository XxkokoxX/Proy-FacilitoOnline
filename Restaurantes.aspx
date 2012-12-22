<%@ Page Title="" Language="C#" MasterPageFile="~/Principal.master" AutoEventWireup="true" CodeFile="Restaurantes.aspx.cs" Inherits="Restaurantes" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <table style="width:100%;">
        <tr>
            <td colspan="2"><a>Inicio</a> > <a>Restaurantes</a> > <a>Lima</a> > <a>Lima</a></td>
        </tr>
        <tr>
            <td colspan="2" style="height: 59px"><h3>Búsqueda de Restaurantes</h3></td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table style="width: 100%;" class="ic_container">
                    <tr>
                        <td align="center">
                            <a href="Login_Cliente.aspx"><img src="img/Banners/regClie.png" alt="" style="width: 200px" /></a>
                        </td>
                    </tr>
                </table>
            </td>
            <td rowspan="15" valign="top">
                <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                    Width="100%" BackColor="White" BorderColor="#CCCCCC" BorderStyle="None" 
                    BorderWidth="1px" CellPadding="4" ForeColor="Black" GridLines="Horizontal" 
                    >
                    <Columns>
                        <asp:TemplateField ControlStyle-BorderStyle="None" FooterStyle-BorderStyle="None" HeaderStyle-BorderStyle="None" ItemStyle-BorderStyle="None" >
                            <HeaderTemplate>
                                <table style="width:100%;">
                                    <tr>
                                        <td width="10%">Nombre</td>
                                        <td>&nbsp;</td>
                                        <td width="25%"></td>
                                        <td>&nbsp;</td>
                                        <td width="15%">Local</td>
                                        <td>&nbsp;</td>
                                        <td width="30%">Comida</td>
                                        <td>&nbsp;</td>
                                        <td width="20%">Precio</td>
                                    </tr>
                                </table>
                            </HeaderTemplate>
                            <ItemTemplate>
                                <table style="width:100%;" class="ic_container" >
                                    <tr>
                                        <td rowspan="2" width="10%">
                                            <div id="user-avatar">
                                                <a href="Restaurantes_detalle.aspx?m=<%# Eval("razonSocial") %>"><asp:Image ID="Image1" runat="server" Height="80px" 
                                                    ImageUrl='<%# Eval("membresia", "img/avatar/{0}.jpg") %>' Width="80px" /></a>
                                            </div>
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td width="25%">
                                            <a href="Restaurantes_detalle.aspx?m=<%# Eval("razonSocial") %>">
                                            <asp:Label ID="lblRazonSocial" runat="server" Text='<%# Eval("razonSocial") %>' style="font-weight:bold;font-size:large"></asp:Label>
                                            </a>
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td width="15%">
                                            <asp:Label ID="lblLocal" runat="server" Text='<%# Eval("municipio") %>'></asp:Label>
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td width="30%">
                                            <asp:Label ID="lblomida" runat="server" 
                                                Text='<%# Eval("listadoDeProductos") %>'></asp:Label>
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td width="20%">
                                            <asp:Label ID="lblPrecio" runat="server" Text="S/. 20 - S/. 40"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            <asp:Label ID="lblCalle" runat="server" Text='<%# Eval("calle") %>'></asp:Label>
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td><a href="Restaurantes_detalle.aspx?m=<%# Eval("razonSocial") %>">Ver m&aacute;s</a></td>
                                    </tr>
                                </table>
                            </ItemTemplate>
                            <ControlStyle BorderStyle="None"></ControlStyle>

                            <FooterStyle BorderStyle="None"></FooterStyle>

                            <HeaderStyle BorderStyle="None"></HeaderStyle>

                            <ItemStyle BorderStyle="None"></ItemStyle>
                        </asp:TemplateField>
                    </Columns>
                    <FooterStyle BackColor="#CCCC99" ForeColor="Black" />
                    <HeaderStyle BackColor="#333333" Font-Bold="True" ForeColor="White" />
                    <PagerStyle BackColor="White" ForeColor="Black" HorizontalAlign="Right" />
                    <SelectedRowStyle BackColor="#CC3333" Font-Bold="True" ForeColor="White" />
                    <SortedAscendingCellStyle BackColor="#F7F7F7" />
                    <SortedAscendingHeaderStyle BackColor="#4B4B4B" />
                    <SortedDescendingCellStyle BackColor="#E5E5E5" />
                    <SortedDescendingHeaderStyle BackColor="#242121" />
                </asp:GridView>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">&nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td>
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">
                                Busca tu restaurante</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Resultado de búsqueda para:</td>
                    </tr>
                    <tr>
                        <td>
                            <asp:TextBox ID="txtRestaurante" runat="server" Width="200px"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                Departamento:</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:DropDownList ID="cboDepartamento" runat="server" Width="200px">
                            </asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                                Provincia:
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:DropDownList ID="cboProvincia" runat="server" Width="200px">
                            </asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <asp:Button ID="btnBuscar" runat="server" CssClass="orange button" 
                                onclick="btnBuscar_Click" Text="Buscar" Width="100px" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">&nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td>
                             <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">Ubicación</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox1" runat="server" Text="Todos" /></td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox2" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4></h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4></h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" align="right"><a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">&nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td style="background-image: url('estilos/Plantilla/img/tabla_cabecera.png'); background-repeat: no-repeat">
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">Tipo de Local</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox3" runat="server" Text="Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox4" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="right" align="center">
                            <a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                &nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td style="background-image: url('estilos/Plantilla/img/tabla_cabecera.png'); background-repeat: no-repeat">
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;"> Tipo de Comida</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox5" runat="server" Text="Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox6" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="right" align="center">
                            <a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                &nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td style="background-image: url('estilos/Plantilla/img/tabla_cabecera.png'); background-repeat: no-repeat">
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">Precios</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox7" runat="server" Text="Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox8" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="right" align="center">
                            <a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                &nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td style="background-image: url('estilos/Plantilla/img/tabla_cabecera.png'); background-repeat: no-repeat">
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">Servicios</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox9" runat="server" Text="Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox10" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="right" align="center">
                            <a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                &nbsp;</td>
        </tr>
        <tr>
            <td width="20%" valign="top">
                <table class="ic_container" width="100%">
                    <tr>
                        <td style="background-image: url('estilos/Plantilla/img/tabla_cabecera.png'); background-repeat: no-repeat">
                            <h4 style="background-color: #666666; color: #FFFFFF; font-size: large;">Formas de Pago</h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox11" runat="server" Text="Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:CheckBox ID="CheckBox12" runat="server" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <h4>
                            </h4>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td align="right" align="center">
                            <a>Ver más</a></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</asp:Content>

