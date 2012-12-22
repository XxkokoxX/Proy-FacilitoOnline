<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="Ofertas_Socio.aspx.cs" Inherits="Ofertas_Socio" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">

    <table style="width: 100%;">
        <tr>
            <td colspan="4"><b>Datos de la Oferta</b></td>
        </tr>
        <tr>
            <td><b>Descripcion:</b></td>
            <td>
                <asp:TextBox ID="txtDescripcion" runat="server" Width="200px" Height="80px"></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                ControlToValidate="txtDescripcion" ErrorMessage="Ingrese la descripcion." 
                ToolTip="La descripcion es obligatoria." ValidationGroup="RegCliValidationGroup" 
                CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
            </td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><b>Fecha Inicio:</b></td>
            <td>
                <asp:TextBox ID="txtFechaInicio" runat="server" Width="200px" ></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" 
                    ControlToValidate="txtFechaInicio" ErrorMessage="Ingrese la fecha de inicio" 
                    ToolTip="La fecha de inicio es obligatoria." ValidationGroup="RegCliValidationGroup"
                    CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
            </td>
            <td><b>Fecha Fin:</b></td>
            <td>
                <asp:TextBox ID="txtFechaFin" runat="server" Width="200px" ></asp:TextBox>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" 
                    ControlToValidate="txtFechaFin" ErrorMessage="Ingrese la fecha de fin" 
                    ToolTip="La fecha de fin es obligatoria." ValidationGroup="RegCliValidationGroup"
                    CssClass="failureNotification"><img alt="" src="img/iconos/admiracion1.png" /></asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
                ValidationGroup="RegCliValidationGroup" CssClass="error" 
                DisplayMode="List" />
        </tr>        
        <tr>
            <td><asp:Label ID="lblMensaje" runat="server" Text="" CssClass="failureNotification"></asp:Label></td>
            <td></td>
            <td></td>
            <td class="image2" style="padding-bottom: 10px;">
                &nbsp;&nbsp;&nbsp;
                <img alt="" src="img/iconos/guardar.png" alt="" style="width: 26px; height: 26px; padding-right:10px; position: relative; top:8px;" /> 
                <asp:Button ID="btnGrabar" 
                    runat="server" Text="Grabar" onclick="btnGrabar_Click" 
                    Width="100px" ForeColor="#FF3300" 
                    ToolTip="Clic aqui para grabar." ValidationGroup="RegCliValidationGroup" />
            </td>
        </tr>
    </table>

    <asp:GridView ID="gridAlertas" runat="server" 
    AutoGenerateColumns="False"   
    onrowdeleting="GridView1_RowDeleting"  
    BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" 
    CellPadding="4" ForeColor="Black" GridLines="Vertical" Width="100%"
    onselectedindexchanged="GridView1_SelectedIndexChanged" >
    <AlternatingRowStyle BackColor="White" />
    <Columns>
        <asp:CommandField HeaderText="Seleccionar" ShowSelectButton="True" 
            ButtonType="Image" SelectImageUrl="~/img/iconos/fle.png" >
        <ItemStyle HorizontalAlign="Center" />
        </asp:CommandField>
        <asp:BoundField DataField="id" HeaderText="Codigo" />
        <asp:BoundField DataField="descripcion" HeaderText="Descripcion" />
        <asp:BoundField DataField="fecha_inicio" HeaderText="Fecha Inicio" />
        <asp:BoundField DataField="fecha_fin" HeaderText="Fecha Fin" /> 
        <asp:CommandField ButtonType="Image" DeleteImageUrl="~/img/iconos/eli.png" 
                                ShowDeleteButton="True" HeaderText="Eliminar" />       
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
    
    <asp:HiddenField ID="hdfCodigoAlerta" runat="server" />  
</asp:Content>

