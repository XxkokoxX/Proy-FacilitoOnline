<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ConsultarReservas.aspx.cs" Inherits="ConsultarReservas" Debug="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
<div class="line"></div> 
    <div class="article">
        <div style="background-position: left;">
            <h2><b>Consultar Reservas</b></h2><br />
            <table style="width: 100%; height: 143px;" class="ic_container">
                <tbody>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/buscar.png" />
                            <asp:Button ID="btnConsultar" runat="server" Text="Buscar"
                                Width="100px" ForeColor="#FF3300" 
                                ToolTip="Clic aqui para listar comentarios." 
                                onclick="btnBuscar_Click" CssClass="yellow button"  />
                        </td>
                        <td rowspan="3">                 
                            <table style="width:100%;">
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Seleciona Cliente</b></td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Cliente</b></td>
                                    <td>
                                        <asp:DropDownList ID="cboCliente" runat="server">
                                        </asp:DropDownList>
                                    </td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="15%" colspan="2" style="width: 45%"><b>Listar por rango de fechas</b></td>
                                    <td width="20%">&nbsp;</td>
                                    <td width="35%">
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha Inicio:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaInicio" runat="server" Width="200px" 
                                            CssClass="campo-field" ></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td><b>Fecha Fin:</b></td>
                                    <td>
                                        <asp:TextBox ID="txtFechaFin" runat="server" Width="200px" 
                                            CssClass="campo-field"></asp:TextBox>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        &nbsp;</td>
                                </tr>
                                <tr>
                                    <td colspan="4"><b><asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label></b></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img src="img/iconos/limpiar.png" alt="" />
                            <asp:Button ID="btnLimpiar" runat="server" Text="Limpiar" Width="100px" 
                                ForeColor="#FF3300" ToolTip="Click aquí para limpiar los controles." 
                                CssClass="yellow button" onclick="btnLimpiar_Click" />
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 1px dotted silver;width: 165px; height: 45px;">
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <img alt="" src="img/iconos/salir.png" />
                            <asp:Button ID="Button2" runat="server" ForeColor="#FF3300" 
                                PostBackUrl="~/PanelVisitante.aspx" Text="Regresar" 
                                ToolTip="Click aquí para cancelar." Width="100px" 
                                CssClass="yellow button" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div><br />

    <div class="line"></div><br />  

    <div class="article">
        <table width="100%" class="ic_container">
            <tr>
                <td align="center"><h3><b>Consultar Reservas</b></h3></td>
            </tr>
            <tr>
                <td> 
                    <asp:GridView ID="GridView1" runat="server" Width="100%" 
                        AutoGenerateColumns="False"
                                OnRowEditing="GridView1_RowEditing" 
                                OnRowUpdating="GridView1_RowUpdating"
                                OnRowDeleting="GridView1_RowDeleting"
                                OnRowCancelingEdit="GridView1_RowCancelingEdit" BackColor="White" 
                        BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" CellPadding="4" 
                        ForeColor="Black" GridLines="Vertical">
                        <AlternatingRowStyle BackColor="White" />
                        <Columns>
                            <asp:CommandField ButtonType="Image" EditImageUrl="~/img/iconos/lapiz.jpg" 
                                HeaderText="Editar" ShowEditButton="True">
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:CommandField>
                            <asp:BoundField DataField="id" HeaderText="id" ReadOnly="True" >
                            <FooterStyle Font-Size="0pt" />
                            <HeaderStyle Font-Size="0pt" Width="0px" />
                            <ItemStyle Font-Size="0pt" Width="0px" />
                            </asp:BoundField>
                            <asp:BoundField DataField="ruc" HeaderText="Ruc" ReadOnly="True" />
                            <asp:BoundField DataField="municipio" HeaderText="Local" 
                                ReadOnly="True" >
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:BoundField DataField="fecha_res" HeaderText="Fecha Reserva" 
                                DataFormatString="{0:MM/dd/yyyy} " ReadOnly="True" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:BoundField DataField="hora" HeaderText="Hora" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:BoundField DataField="cantidad" HeaderText="Cantidad de personas" >
                            <HeaderStyle HorizontalAlign="Center" />
                            <ItemStyle HorizontalAlign="Center" />
                            </asp:BoundField>
                            <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                HeaderText="Cancelar Reserva" ShowDeleteButton="True">
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

