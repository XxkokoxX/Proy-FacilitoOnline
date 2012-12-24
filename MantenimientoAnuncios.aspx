<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoAnuncios.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Usuarios</b></h2>
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/nuevo.png" />
                            <asp:Button ID="btnNuevo" runat="server" Text="Nuevo" onclick="btnNuevo_Click" 
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para ingresar un nuevo usuario." 
                                CssClass="yellow button"  />
                        </td>
                        <td rowspan="4">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Datos del Anuncio:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtRazonSocial" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        </td>
                                    <td width="20%"><b></b></td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Título del Anuncio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtTitulo" runat="server" Enabled="False" Width="200px" ></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                            ControlToValidate="txtTitulo" ErrorMessage="Ingrese un Título." 
                                            ToolTip="La contraseña es obligatoria." ValidationGroup="RegAnunValidationGroup"
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b></b></td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Foto o Video:</b></td>
                                    <td>
                                        <asp:FileUpload ID="FileUpload1" runat="server" Enabled="False" /></td>
                                    <td><b></b></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Descripción:</b></td>
                                    <td>&nbsp;</td>
                                    <td><b></b></td>
                                    <td>
                                            
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" rowspan="4">
                                        <asp:TextBox ID="txtDescripcion" runat="server" Height="100px" 
                                            TextMode="MultiLine" Width="500px"></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="height: 26px"></td>
                                </tr>
                                <tr>
                                    <td><b>Fecha de Registro:</b></td>
                                    <td>
                                        <asp:Label ID="lblFechaRegistro" runat="server"></asp:Label>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/guardar.png" alt=""/>
                            <asp:Button ID="btnGrabar" 
                                runat="server" Text="Grabar" onclick="btnGrabar_Click" 
                                Enabled="False" Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegAnunValidationGroup" 
                                CssClass="yellow button" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnCancelar" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelSocio.aspx" CssClass="yellow button" />
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
        
    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="RegAnunValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div>

    <div class="line"></div>   
        
    <div class="article">
        <table style="width: 100%;" align="center">
            <tr>
                <td align="center"><h3><b>Lista de Anuncios</b></h3></td>
            </tr>
            <tr>
                <td align="center">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        BorderColor="#DEDFDE" BorderWidth="1px" onrowdeleting="GridView1_RowDeleting" 
                        onselectedindexchanged="GridView1_SelectedIndexChanged" Width="50%" 
                        AllowPaging="True" BackColor="White" BorderStyle="None" CellPadding="4" 
                        ForeColor="Black" GridLines="Vertical" 
                        onpageindexchanging="GridView1_PageIndexChanging">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ButtonType="Image" HeaderText="Editar Anuncio" 
                                SelectImageUrl="~/img/iconos/lapiz.jpg" ShowSelectButton="True">
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                            <asp:BoundField DataField="titulo" HeaderText="Titulo del  Anuncio" />
                            <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                HeaderText="Eliminar Anuncio" ShowDeleteButton="True">
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:CommandField>
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
                </td>
            </tr>
        </table>
    </div>
</asp:Content>

