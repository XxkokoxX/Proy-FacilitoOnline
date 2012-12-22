<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="EditarAnuncios.aspx.cs" Inherits="MantenimientoUsuario" %>

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
                                ValidationGroup="RegAnunValidationGroup" />
                        </td>
                        <td rowspan="8">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Datos del Anuncio:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtCodigo" runat="server" Enabled="False" Width="200px" 
                                            Visible="False"></asp:TextBox>
                                        </td>
                                    <td width="20%"><b></b></td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Título del Anuncio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtTitulo" runat="server" Width="200px" ></asp:TextBox>
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
                                    <td colspan="2">
                                        <asp:FileUpload ID="FileUpload1" runat="server" />
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td rowspan="6"><asp:Image ID="figura" runat="server" Height="164px" Width="226px" /></td>
                                    <td><b></b></td>
                                    <td>
                                            
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Descripción</b></td>
                                    <td>&nbsp;</td>
                                    <td>
                                            
                                        &nbsp;</td>
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
                                        <asp:Label ID="lblCodigo" runat="server" Text="Label" Visible="False"></asp:Label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/salir.png" alt="" />
                            <asp:Button ID="btnRegresar" runat="server" Text="Regresar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                PostBackUrl="~/MantenimientoAnuncios.aspx" />
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
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
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
</asp:Content>

