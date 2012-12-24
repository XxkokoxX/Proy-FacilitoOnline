<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoPermisosClientesYUsuario.aspx.cs" Inherits="MantenimientoPermisosClientesYUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div>
    <div class="article">
        <div style="background-position: left;">
            <h2>
                <b>Administrar Permisos de Usuarios y Clientes</b></h2>
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tr>
                    <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <img alt="" src="img/iconos/nuevo.png" />
                        <asp:Button ID="btnNuevo" runat="server" ForeColor="#FF3300" 
                            onclick="btnNuevo_Click" Text="Nuevo" 
                            ToolTip="Clic aqui para ingresar un nuevo usuario." Width="100px" 
                            CssClass="yellow button" />
                    </td>
                    <td rowspan="3">
                        <table style="width:100%;">
                            <tr>
                                <td width="15%"><b>Usuario:</b></td>
                                <td width="30%">
                                    <asp:TextBox ID="txtUsuarioCliente" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                            ControlToValidate="txtUsuarioCliente" ErrorMessage="Ingrese la cuenta de usuario." 
                                            ToolTip="La cuenta de usuario es obligatoria." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                </td>
                                <td width="20%"><b>Permisos:</b></td>
                                <td width="35%">&nbsp;</td>
                            </tr>
                            <tr>
                                <td width="15%"><b>Usuario Activo:</b></td>
                                <td width="30%">
                                    <asp:CheckBox ID="chkActivo" runat="server" Enabled="False" />
                                </td>
                                <td width="20%"><b>Permiso Administrador:</b></td>
                                <td width="35%"><asp:CheckBox ID="chkAdministrador" runat="server" 
                                        Enabled="False" />
                                </td>
                            </tr>
                            <tr>
                                <td><b>Fecha Actual:</b></td>
                                <td><asp:Label ID="lblFechaRegistro" runat="server"></asp:Label></td>
                                <td><b>Permiso Visitante:</b></td>
                                <td><asp:CheckBox ID="chkVisitante" runat="server" Enabled="False" /></td>
                            </tr>
                            <tr>
                                <td style="height: 22px"></td>
                                <td style="height: 22px">
                                    &nbsp;</td>
                                <td style="height: 22px"><b>Permiso Cliente Socio</b></td>
                                <td style="height: 22px"><asp:CheckBox ID="chkSocio" runat="server" 
                                        Enabled="False" /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>&nbsp;</td>
                                <td><b>Permiso Cliente Invitado:</b></td>
                                <td>
                                    <asp:CheckBox ID="chkInvitado" runat="server" Enabled="False" />
                                </td>
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
                        <img alt="" src="img/iconos/guardar.png" />
                        <asp:Button ID="btnGrabar" runat="server" Enabled="False" ForeColor="#FF3300" 
                            onclick="btnGrabar_Click" Text="Grabar" ToolTip="Clic aqui para grabar." 
                            ValidationGroup="RegUserValidationGroup" Width="100px" 
                            CssClass="yellow button" />
                    </td>
                </tr>
                <tr>
                    <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                        &nbsp;&nbsp;&nbsp;
                        <img alt="" src="img/iconos/salir.png" />
                        <asp:Button ID="btnCancelar" runat="server" ForeColor="#FF3300" 
                            PostBackUrl="~/PanelAdministrador.aspx" Text="Cancelar" 
                            ToolTip="Click aquí para cancelar." Width="100px" 
                            CssClass="yellow button" />
                    </td>
                </tr>
            </table>
        </div>
    </div><br />

    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="RegUserValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div><br />

    <div class="line"></div>

    <div class="article">
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Lista de Usuario y Cliente sin Permisos</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView2_PageIndexChanging" 
                        onselectedindexchanged="GridView2_SelectedIndexChanged" Width="100%" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" >
                   
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                   
                            <asp:BoundField DataField="email" HeaderText="Cuenta de Usuario" />
                   
                            <asp:BoundField DataField="usuarios" HeaderText="Propietario" />
                            <asp:BoundField DataField="descripcion" HeaderText="Tipo de Cuenta" />

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
        <br /><br />
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Lista de Permisos de Usuarios y Clientes</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" 
                        onselectedindexchanged="GridView1_SelectedIndexChanged" Width="100%" 
                        DataKeyNames="activo,administrador,visitante,clienteSocio,clienteInvitado" onrowdatabound="GridView1_RowDataBound" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" >
                   
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                   
                            <asp:BoundField DataField="usuario" HeaderText="Cuenta de Usuario" />
                   
                            <asp:TemplateField HeaderText="Activo">
                                <EditItemTemplate>
                                    <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("activo") %>'></asp:TextBox>
                                </EditItemTemplate>
                                <ItemTemplate>
                                    <asp:Label ID="lblActivo" runat="server" Text='<%# Bind("activo") %>' 
                                        Visible="False"></asp:Label>
                                    <asp:Image ID="Image2" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Administrador">
                                <EditItemTemplate>
                                    <asp:TextBox ID="TextBox2" runat="server" Text='<%# Bind("administrador") %>'></asp:TextBox>
                                </EditItemTemplate>
                                <ItemTemplate>
                                    <asp:Label ID="lblAdministrador" runat="server" 
                                        Text='<%# Bind("administrador") %>' Visible="False"></asp:Label>
                                    <asp:Image ID="Image3" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Visitante">
                                <EditItemTemplate>
                                    <asp:TextBox ID="TextBox3" runat="server" Text='<%# Bind("visitante") %>'></asp:TextBox>
                                </EditItemTemplate>
                                <ItemTemplate>
                                    <asp:Label ID="lblVisitante" runat="server" Text='<%# Bind("visitante") %>' 
                                        Visible="False"></asp:Label>
                                    <asp:Image ID="Image4" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Cliente Socio">
                                <EditItemTemplate>
                                    <asp:TextBox ID="TextBox4" runat="server" Text='<%# Bind("clienteSocio") %>'></asp:TextBox>
                                </EditItemTemplate>
                                <ItemTemplate>
                                    <asp:Label ID="lblSocio" runat="server" Text='<%# Bind("clienteSocio") %>' 
                                        Visible="False"></asp:Label>
                                    <asp:Image ID="Image5" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Cliente Invitado">
                                <EditItemTemplate>
                                    <asp:TextBox ID="TextBox5" runat="server" Text='<%# Bind("clienteInvitado") %>'></asp:TextBox>
                                </EditItemTemplate>
                                <ItemTemplate>
                                    <asp:Label ID="lblInvitado" runat="server" 
                                        Text='<%# Bind("clienteInvitado") %>' Visible="False"></asp:Label>
                                    <asp:Image ID="Image6" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>

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

