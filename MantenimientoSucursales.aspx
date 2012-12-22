﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoSucursales.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Sucursales</b></h2>
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
                        <td rowspan="5">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Surcursal:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtSucursal" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtSucursal" ErrorMessage="Ingrese sucursal." 
                                            ToolTip="La sucursal es obligatoria." ValidationGroup="RegSucurValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="20%"><b>Telefono</b></td>
                                    <td width="35%">
                                        <asp:TextBox ID="txtTelefono" runat="server" Enabled="False" Width="200px"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="15%"><b>Departamento:</b></td>
                                    <td width="30%">
                                        <asp:DropDownList ID="cboDepartamento" runat="server" Enabled="False" 
                                            AutoPostBack="True" 
                                            onselectedindexchanged="cboDepartamento_SelectedIndexChanged" 
                                            Width="204px">
                                        </asp:DropDownList>
                                    </td>
                                    <td width="20%"><b>Imagen</b></td>
                                    <td width="35%">
                                        <asp:TextBox ID="txtCliente" runat="server" Visible="False"></asp:TextBox>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Distrtio:</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboDistrito" runat="server" Enabled="False" Width="204px">
                                        </asp:DropDownList>
                                    </td>
                                    <td colspan="2">
                                        <asp:FileUpload ID="FileUpload1" runat="server" Enabled="False" /></td>
                                </tr>
                                <tr>
                                    <td><b>Dirección</b></td>
                                    <td>
                                        <asp:TextBox ID="txtDireccion" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        </td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                    </td>
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
                                    <td><b>Descripción:</b></td>
                                    <td>
                                        &nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="3" rowspan="4">
                                        <asp:TextBox ID="txtDescripcion" runat="server" Enabled="False" Height="90px" 
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
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="4"><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
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
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegSucurValidationGroup" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnCancelar" runat="server" Text="Cancelar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/PanelSocio.aspx" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
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
            ValidationGroup="RegSucurValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div>

    <div class="line"></div>   
        
    <div class="article">
        <table style="width: 100%;">
            <tr>
                <td align="center"><h3><b>Lista de Sucursales</b></h3></td>
            </tr>
            <tr>
                <td style="border-right: 1px dotted silver; text-align: left; vertical-align: top; ">
                    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" 
                        AllowPaging="True" 
                        onpageindexchanging="GridView1_PageIndexChanging" 
                        onselectedindexchanged="GridView1_SelectedIndexChanged" 
                        onrowdeleting="GridView1_RowDeleting" Width="100%" 
                        BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
                        CellPadding="4" ForeColor="Black" GridLines="Vertical" PageSize="5">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ShowSelectButton="True" ButtonType="Image" 
                                SelectImageUrl="~/img/iconos/fle.png" HeaderText="Seleccionar" >
                   
                            <HeaderStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                   
                            <asp:boundfield datafield="id" headertext="Id">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:boundfield datafield="sucursal" headertext="Sucursal">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="desc_sucursal" 
                                HeaderText="Descripción" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle Width="100px" />
                            </asp:BoundField>

                            <asp:boundfield datafield="telefono" headertext="Telelefono">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="id_distrito" HeaderText="Distrito" />

                            <asp:BoundField DataField="direccion" HeaderText="Dirección" >
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                                                                       
                            <asp:boundfield datafield="fecha_inscripcion" headertext="Fecha de Registro">
                            </asp:boundfield>
                        
                            <asp:TemplateField HeaderText="Imagen">
                                <ItemTemplate>
                                    <asp:Image ID="Image3" runat="server" Height="84px" 
                                        ImageUrl='<%# Eval("id", "img/sucursales/{0}.jpg") %>' Width="84px" />
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
                    <asp:HiddenField ID="hdfCodigoAlerta" runat="server" />
                </td>
            </tr>
        </table>
    </div>
</asp:Content>
