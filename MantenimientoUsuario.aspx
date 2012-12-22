<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoUsuario.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Usuarios</b></h2>
            <table style="width: 100%; height: 143px;">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/nuevo.png" />
                            <asp:Button ID="btnNuevo" runat="server" Text="Nuevo" onclick="btnNuevo_Click" 
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para ingresar un nuevo usuario."  />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Email:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtEmail" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                        ControlToValidate="txtEmail" ErrorMessage="Ingrese el e-mail." 
                                        ToolTip="El email es obligatorio." ValidationGroup="RegUserValidationGroup" 
                                        CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="20%"><b>Tipo de Usuario</b></td>
                                    <td width="35%">
                                        <asp:DropDownList ID="cboTipoUsuario" runat="server" Width="153px" 
                                            Enabled="False">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Contraseña:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtContraseña" runat="server" Enabled="False" Width="200px" ></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                            ControlToValidate="txtContraseña" ErrorMessage="Ingrese una contraseña." 
                                            ToolTip="La contraseña es obligatoria." ValidationGroup="RegUserValidationGroup"
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>Fecha de Nacimiento:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaDeNacimiento" runat="server" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" 
                                            ControlToValidate="txtFechaDeNacimiento" ErrorMessage="Ingrese la fecha de nacimiento." 
                                            ToolTip="La fecha de nacimiento es obligatoria." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Nombres:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtNombres" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                            ControlToValidate="txtNombres" ErrorMessage="Ingrese los nombres." 
                                            ToolTip="El nombre es obligatio." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>Fecha de Registro<b>:</b></td>
                                    <td>
                                        <asp:Label ID="lblFechaRegistro" runat="server"></asp:Label>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Apellidos</b></td>
                                    <td>
                                        <asp:TextBox ID="txtApellidos" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                            ControlToValidate="txtApellidos" ErrorMessage="Ingrese los Apellidos." 
                                            ToolTip="El apelllido es obligatorio." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>Cambiar Avatar</b></td>
                                    <td>
                                            
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Dirección:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtDireccion" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtDireccion" ErrorMessage="Ingrese la dirección." 
                                            ToolTip="La dirección es obligatoria." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                        </td>
                                    <td colspan="2"><asp:FileUpload ID="FileUpload1" runat="server" Enabled="False" /></td>
                                </tr>
                                <tr>
                                    <td colspan="5"><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></td>
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
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegUserValidationGroup" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnCancelar" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelAdministrador.aspx" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
        
    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="RegUserValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div>

    <div class="line"></div>   
        
    <div class="article">
        <table style="width: 100%;">
            <tr>
                <td align="center"><h3><b>Lista de Usuarios</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" 
                        onselectedindexchanged="GridView1_SelectedIndexChanged" 
                        onrowdeleting="GridView1_RowDeleting" Width="100%" 
                        DataKeyNames="tipoUsuario" onrowdatabound="GridView1_RowDataBound" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" >
                   
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                   
                            <asp:boundfield datafield="email" headertext="E-mail">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:boundfield datafield="contraseña" headertext="Contraseña">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:boundfield datafield="nombres" headertext="Nombres">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="apellidos" HeaderText="Apellidos" >
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                                                                       
                            <asp:boundfield datafield="direccion" headertext="Dirección">
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>
                        
                            <asp:BoundField DataField="fechaDeNacimiento" 
                                HeaderText="Fecha de Nacimiento" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle Width="100px" />
                            </asp:BoundField>

                            <asp:TemplateField HeaderText="Tipo de Usuario">
                                <ItemTemplate>
                                    <asp:Label ID="lblTipoUsuario" runat="server" Text='<%# Bind("tipoUsuario") %>'></asp:Label>
                                    <asp:Image ID="Image2" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>

                            <asp:BoundField DataField="fechaDeRegistro" HeaderText="Fecha Registro">
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle Width="100px" />
                            </asp:BoundField>
                                                                       
                            <asp:TemplateField HeaderText="Avatar">
                                <ItemTemplate>
                                    <asp:Image ID="Image3" runat="server" Height="84px" 
                                        ImageUrl='<%# Eval("email", "img/avatar/{0}.jpg") %>' Width="84px" />
                                </ItemTemplate>
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

