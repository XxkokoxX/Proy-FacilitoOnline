<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoCliente.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="article">
        <div style="background-position: left;">
            <h3><b>Administrar Clientes</b></h3>
            <table style="width: 100%;">
                <tbody>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/nuevo.png" /> 
                            <asp:Button ID="btnNuevo" runat="server" Text="Nuevo" onclick="btnNuevo_Click" 
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para ingresar un nuevo cliente."  />
                        </td>
                        <td rowspan="10">
                            <table style="width: 100%;">
                                <tr>
                                    <td colspan="4"><b>Datos del Contacto</b></td>
                                </tr>
                                <tr>
                                    <td><b>Membresia:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtMembresia" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                        ControlToValidate="txtMembresia" ErrorMessage="Ingrese la membresia." 
                                        ToolTip="La membresia es obligatoria." ValidationGroup="RegCliValidationGroup" 
                                        CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>E-mail:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtEmail" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator7" runat="server" 
                                            ControlToValidate="txtEmail" ErrorMessage="Ingrese el e-mail." 
                                            ToolTip="El e-mail es onligatorio." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Clave:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtClave" runat="server" Enabled="False" Width="200px" ></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                                            ControlToValidate="txtClave" ErrorMessage="Ingrese una clave." 
                                            ToolTip="La clave es obligatoria." ValidationGroup="RegCliValidationGroup"
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>Cargo:</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboCargo" runat="server" Enabled="False" Width="204px">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Contacto:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtContacto" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                            ControlToValidate="txtContacto" ErrorMessage="Ingrese el nombre del contacto." 
                                            ToolTip="Ingrese el nombre del contacto." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="4"><b>Datos de la Empresa</b></td>
                                </tr>
                                <tr>
                                    <td><b>Razón Social</b></td>
                                    <td colspan="3">
                                        <asp:TextBox ID="txtRazonSocial" runat="server" Enabled="False" Width="483px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                            ControlToValidate="txtRazonSocial" ErrorMessage="Ingrese la razón social." 
                                            ToolTip="La razón social es obligatoria." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Calle:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtCalle" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtCalle" ErrorMessage="Ingrese la dirección." 
                                            ToolTip="Ingrese la dirección." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                        </td>
                                    <td><b>Municipio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtMunicipio" runat="server" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator9" runat="server" 
                                            ControlToValidate="txtMunicipio" ErrorMessage="Ingrese el municipio." 
                                            ToolTip="Ingrese el municipio." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Número Exterior:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtNumeroExterior" runat="server" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator8" runat="server" 
                                            ControlToValidate="txtNumeroExterior" ErrorMessage="Ingrese el número exterior." 
                                            ToolTip="Ingrese el número exterior." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td><b>Número Interior:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtNumeroInterior" runat="server" Enabled="False"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>CP:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtCP" runat="server" Enabled="False"></asp:TextBox>
                                            <asp:RequiredFieldValidator ID="RequiredFieldValidator5" runat="server" 
                                            ControlToValidate="txtCP" ErrorMessage="Ingrese el código postal." 
                                            ToolTip="Ingrese el código postal." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                        </td>
                                    <td><b>Ciudad:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtCiudad" runat="server" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator10" runat="server" 
                                            ControlToValidate="txtCiudad" ErrorMessage="Ingrese la ciudad." 
                                            ToolTip="Ingrese la ciudad." ValidationGroup="RegCliValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>País:</b></td>
                                    <td style="height: 27px">
                                        <asp:DropDownList ID="cboPais" runat="server" Enabled="False" width="153px">
                                        </asp:DropDownList>
                                    </td>
                                    <td style="height: 27px"><b>Estado:</b></td>
                                    <td style="height: 27px">
                                        <asp:DropDownList ID="cboEstado" runat="server" Enabled="False" Width="153px">
                                        </asp:DropDownList>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Tipo Cliente:</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboTipoCliente" runat="server" Enabled="False" width="153px">
                                        </asp:DropDownList>
                                    </td>
                                    <td></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>Sitio Web:</b></td>
                                    <td colspan="3" style="height: 27px">
                                        <asp:TextBox ID="txtSitioWeb" runat="server" Width="483px" Enabled="False"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>Actividad Preponderante:</b></td>
                                    <td colspan="3" style="height: 27px">
                                        <asp:TextBox ID="txtActividadPreponderante" runat="server" Enabled="False" 
                                            Width="485px" Height="100px" TextMode="MultiLine"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>Listrado de Productos:</b></td>
                                    <td colspan="3" style="height: 34px">
                                        <asp:TextBox ID="txtListarProductos" runat="server" Enabled="False" 
                                            Width="485px" Height="100px" TextMode="MultiLine"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>Fecha de Registro:</b></td>
                                    <td colspan="3" style="height: 27px"><asp:Label ID="lblFechaRegistro" runat="server"></asp:Label></td>
                                </tr>
                                <tr>
                                    <td style="height: 27px"><b>Cambiar Avatar:</b></td>
                                    <td colspan="3" style="height: 27px"><asp:FileUpload ID="FileUpload1" runat="server" Enabled="False" /></td>
                                </tr>
                                <tr>
                                    <td colspan="4" style="height: 27px"><asp:Label ID="lblMensaje" runat="server" Text="" CssClass="failureNotification"></asp:Label></td>
                                </tr>
                                </table>             
                        </td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 180px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/guardar.png" alt="" style="width: 26px; height: 26px" /> 
                            <asp:Button ID="btnGrabar" 
                                runat="server" Text="Grabar" onclick="btnGrabar_Click" 
                                Enabled="False" Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegCliValidationGroup" />
                        </td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 180px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnCancelar" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelAdministrador.aspx" />
                        </td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td class="image2" style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
        ValidationGroup="RegCliValidationGroup" CssClass="error" 
        ShowMessageBox="True" DisplayMode="List" />
    </div>

    <div class="line"></div> 
               
    <div class="article">
        <table style="width: 100%;">
            <tr>
                <td align="center"><h3><b>Destalle de Usuarios</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="gridDetalleCliente" runat="server" 
                        AutoGenerateColumns="False" 
                        onselectedindexchanged="gridDetalleCliente_SelectedIndexChanged" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical" Width="100%">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField HeaderText="Seleccionar" ShowSelectButton="True" 
                                ButtonType="Image" SelectImageUrl="~/img/iconos/fle.png" >
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                            <asp:BoundField DataField="emailContacto" HeaderText="E-mail" />
                            <asp:BoundField DataField="numeroExterior" HeaderText="Numero E." />
                            <asp:BoundField DataField="numeroInterior" DataFormatString="(No Data)" 
                                HeaderText="Número I." />
                            <asp:BoundField DataField="municipio" HeaderText="Municipio" />
                            <asp:BoundField DataField="codigoPostal" HeaderText="CP" />
                            <asp:BoundField DataField="sitioWeb" HeaderText="Sitio Web" />
                            <asp:BoundField DataField="actividadPreponderante" 
                                HeaderText="Actividad Preponderante" />
                            <asp:BoundField DataField="listadoDeProductos" 
                                HeaderText="Listado de Productos" />
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
        </table><br />
        <table style="width: 100%;"> 
            <tr>
                <td align="center"><h3><b>Lista de Usuarios</b></h3></td>
            </tr>
            <tr>
                <td colspan="2">                 
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" 
                        onselectedindexchanged="GridView1_SelectedIndexChanged" 
                        onrowdeleting="GridView1_RowDeleting" Width="100%" 
                        DataKeyNames="tipoCliente" onrowdatabound="GridView1_RowDataBound" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" />
                   
                            <asp:boundfield datafield="membresia" headertext="Membresia">
                            </asp:boundfield>

                            <asp:boundfield datafield="clave" headertext="Clave">
                            </asp:boundfield>

                            <asp:boundfield datafield="nombreContacto" headertext="Contacto">
                            </asp:boundfield>

                            <asp:BoundField DataField="emailContacto" HeaderText="E-mail" Visible="False" >
                            </asp:BoundField>
                                                                       
                            <asp:boundfield datafield="cargoContacto" headertext="Cargo">
                            </asp:boundfield>
                        
                            <asp:BoundField DataField="razonSocial" 
                                HeaderText="Razon Social" />

                            <asp:BoundField DataField="calle" HeaderText="Dirección">
                            </asp:BoundField>
                                                                       
                            <asp:BoundField DataField="numeroExterior" HeaderText="Número Exterior" 
                                Visible="False" />
                            <asp:BoundField DataField="numeroInterior" HeaderText="Número Interior" 
                                Visible="False" />
                            <asp:BoundField DataField="municipio" HeaderText="Municipio" Visible="False" />
                            <asp:BoundField DataField="codigoPostal" HeaderText="CP" Visible="False" />
                            <asp:BoundField DataField="ciudad" HeaderText="Ciudad" />
                            <asp:BoundField DataField="pais" HeaderText="Pais" />
                            <asp:BoundField DataField="estado" HeaderText="Estado" />
                            <asp:BoundField DataField="sitioWeb" HeaderText="Sitio Web" 
                                NullDisplayText="(No Data)" Visible="False" />
                            <asp:BoundField DataField="actividadPreponderante" HeaderText="Actividad P" 
                                NullDisplayText="(No Data)" Visible="False" />
                            <asp:BoundField DataField="listadoDeProductos" HeaderText="Listado de P" 
                                NullDisplayText="(No Data)" Visible="False" />
                                                                       
                            <asp:TemplateField HeaderText="Tipo de Cliente">
                                <ItemTemplate>
                                    <asp:Label ID="lblTipoCliente" runat="server" Text='<%# Bind("tipoCliente") %>'></asp:Label>
                                    <asp:Image ID="Image2" runat="server" />
                                </ItemTemplate>
                            </asp:TemplateField>
                            <asp:TemplateField HeaderText="Avatar">
                                <ItemTemplate>
                                    <asp:Image ID="Image3" runat="server" Height="84px" 
                                        ImageUrl='<%# Eval("membresia","img/avatar/{0}.jpg") %>' Width="84px" />
                                </ItemTemplate>
                            </asp:TemplateField>
                                                                       
                            <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                ShowDeleteButton="True" HeaderText="Eliminar" />
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

