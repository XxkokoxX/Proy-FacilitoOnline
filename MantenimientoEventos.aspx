<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="MantenimientoEventos.aspx.cs" Inherits="MantenimientoUsuario" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Administrar Eventos</b></h2><br />
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
                        <td rowspan="5">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%"><b>Evento:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtEvento" runat="server" Width="200px" Enabled="False"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="RequiredFieldValidator6" runat="server" 
                                            ControlToValidate="txtEvento" ErrorMessage="Ingrese un evento." 
                                            ToolTip="El evento es obligatoria." ValidationGroup="RegEventValidationGroup" 
                                            CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
                                    </td>
                                    <td width="20%"><b></b>
                                        <asp:TextBox ID="txtCliente" runat="server" Visible="False"></asp:TextBox>
                                    </td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="15%"><b>Fecha Inicio:</b></td>
                                    <td width="30%">
                                        <asp:TextBox ID="txtFechaInicio" runat="server" Width="200px" Enabled="False" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td width="20%"><b></b></td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha Fin:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaFin" runat="server" Width="200px" Enabled="False" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td colspan="2">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Imagen:</b></td>
                                    <td colspan="2">
                                        <asp:FileUpload ID="FileUpload1" runat="server" Enabled="False" 
                                            CssClass="campo-field" /></td>
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
                                            TextMode="MultiLine" Width="500px" CssClass="campo-field"></asp:TextBox>
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
                                ToolTip="Clic aqui para grabar." ValidationGroup="RegEventValidationGroup" 
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
            ValidationGroup="RegEventValidationGroup" CssClass="error" 
            DisplayMode="List" HeaderText="Error Ingrese los siguientes datos:" 
            ShowMessageBox="True" />
    </div><br />

    <div class="line"></div><br />   
        
    <div class="article">
        <table style="width: 100%;" class="ic_container">
            <tr>
                <td align="center"><h3><b>Lista de Eventos</b></h3></td>
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

                            <asp:boundfield datafield="evento" headertext="Evento">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="descripcion" 
                                HeaderText="Descripción" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle Width="100px" />
                            </asp:BoundField>

                            <asp:boundfield datafield="fecha_inicio" headertext="Fecha Inicio" 
                                DataFormatString="{0:d}">
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:boundfield>

                            <asp:BoundField DataField="fecha_fin" HeaderText="Fecha Fin" 
                                DataFormatString="{0:d}" />

                            <asp:BoundField DataField="estado" HeaderText="Estado" >
                                <HeaderStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                                                                       
                            <asp:boundfield datafield="fechaRegistro" headertext="Fecha de Registro">
                            </asp:boundfield>
                        
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

