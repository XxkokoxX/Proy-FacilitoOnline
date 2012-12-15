<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="EditarServicios.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Usuarios</b></h2>
            <table style="width: 100%; height: 143px;">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/guardar.png" alt=""/>
                            <asp:Button ID="btnGrabar" 
                                runat="server" Text="Grabar" onclick="btnGrabar_Click" Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para grabar." 
                                ValidationGroup="RegProdValidationGroup" />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="13%"><b>Producto:</b></td>
                                    <td width="32%">
                                        <asp:TextBox ID="txtNombre" runat="server" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                                        ControlToValidate="txtNombre" ErrorMessage="Ingrese el producto." 
                                        ToolTip="El producto es obligatorio." ValidationGroup="RegProdValidationGroup" 
                                        CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="20%"><b>Imagen:</b></td>
                                    <td width="35%">
                                        <asp:FileUpload ID="FileUpload1" runat="server" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Categoría:</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboCategoria" runat="server" Width="150px">
                                        </asp:DropDownList>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td rowspan="6">
            <asp:Image ID="foto" runat="server" Height="128px" Width="162px" /> </td>
                                </tr>
                                <tr>
                                    <td><b>Cantidad:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtCantidad" runat="server"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                                            ControlToValidate="txtCantidad" ErrorMessage="Ingrese los cantidad." 
                                            ToolTip="El cantidad es obligatio." ValidationGroup="RegUserValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Precio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtPrecio" runat="server"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" 
                                            ControlToValidate="txtPrecio" ErrorMessage="Ingrese el precio." 
                                            ToolTip="El precio es obligatorio." ValidationGroup="RegProdValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha de Registro:</b></td>
                                    <td>
                                        <asp:Label ID="lblFechaRegistro" runat="server"></asp:Label>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <asp:TextBox ID="txtid" runat="server" Visible="False"></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="3"><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="Button2" runat="server" Text="Regresar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para regresar." 
                                PostBackUrl="~/MantenimientoServicios.aspx" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
        
    <div>
        <span class="failureNotification"><asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span>
        <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
            ValidationGroup="RegProdValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div>

    <div class="line"></div>   
</asp:Content>

