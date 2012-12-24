<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoCategorias.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Categorías</b></h2>
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
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Nueva Categoría:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtCategoria" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                            ControlToValidate="txtCategoria" ErrorMessage="Ingrese una nueva categoría." 
                                            ToolTip="La categoría es obligatoria." ValidationGroup="RegCatValidationGroup"
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                        </td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        &nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        &nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>&nbsp;</td>
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
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegCatValidationGroup" 
                                CssClass="yellow button" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnCancelar" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelSocio.aspx" CssClass="yellow button"  />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
        
    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="RegCatValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div>

    <div class="line"></div>   
        
    <div class="article">
        <table style="width: 100%;" align="center">
            <tr>
                <td align="center"><h3><b>Lista de Categorías de Productos</b></h3></td>
            </tr>
            <tr>
                <td align="center">
                        <asp:GridView ID="GridView1" runat="server" 
                            AutoGenerateColumns="False"    
                            OnRowEditing="GridView1_RowEditing" 
                            OnRowUpdating="GridView1_RowUpdating"
                            OnRowDeleting="GridView1_RowDeleting"
                            OnRowCancelingEdit="GridView1_RowCancelingEdit" BackColor="White" 
                        BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" CellPadding="4" 
                        ForeColor="Black" GridLines="Vertical" Width="50%" AllowPaging="True" 
                            onpageindexchanging="GridView1_PageIndexChanging"> 
                            <AlternatingRowStyle BackColor="White" />
                            <Columns>
                                <asp:CommandField HeaderText="Editar" ShowEditButton="True" ButtonType="Image" 
                                    CancelImageUrl="~/img/iconos/eli.png" 
                                    EditImageUrl="~/img/iconos/lapiz.jpg" >
                                <ItemStyle HorizontalAlign="Center" />
                                </asp:CommandField>
                                <asp:BoundField DataField="id" HeaderText="id" ReadOnly="true" >
                                <HeaderStyle Font-Size="0pt" HorizontalAlign="Center" />
                                <ItemStyle Font-Size="0pt" HorizontalAlign="Center" />
                                </asp:BoundField>
                                <asp:BoundField DataField="descripcion" HeaderText="Categorias" >
                                <ItemStyle HorizontalAlign="Center" />
                                </asp:BoundField>
                                <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                    HeaderText="Eliminar" ShowDeleteButton="True" >
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

