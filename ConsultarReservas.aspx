<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="ConsultarReservas.aspx.cs" Inherits="ConsultarReservas" Debug="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <h2>Consultar Reservas</h2>
    <div>
        <table width="100%" class="ic_container">
            <tr>
                <td> 
                    <asp:GridView ID="GridView1" runat="server" Width="100%" 
                        AutoGenerateColumns="False"
                                OnRowEditing="GridView1_RowEditing" 
                                OnRowUpdating="GridView1_RowUpdating"
                                OnRowDeleting="GridView1_RowDeleting"
                                OnRowCancelingEdit="GridView1_RowCancelingEdit">
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
                    </asp:GridView>
                </td>
            </tr>
            <tr> <td>
                <asp:Label ID="lblMensaje" runat="server"></asp:Label> </td></tr>

            <tr>
                <td><img src="img/iconos/salir.png" alt="" />  
                                           <asp:Button ID="btnCancelar" runat="server" Text="Salir" Width="100px" 
                                    ForeColor="#FF3300" ToolTip="Click aquí para cancelar." 
                                    PostBackUrl="~/PanelVisitante.aspx" CssClass="yellow button" /></td>
            </tr>
        </table>
    </div>
</asp:Content>

