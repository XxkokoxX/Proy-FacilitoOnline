<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Copia (2) de pop.aspx.cs" Inherits="pop" Debug="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
</head>
<body bgcolor="lightblue">
    <form id="form1" runat="server">
    <div >

    <table width="100%" >
        <tr >
            <td colspan="10" bgcolor="Red" ><b>Datos:</b></td>
        </tr>
        <tr>
        <td>
            <b>Usuario</b>
        </td>
            <td>
                <asp:Label ID="lblmembresia" runat="server" Text="Label"></asp:Label>
                
            </td>


        </tr>
        <tr>
            <td>  <b>Ruc </b>  </td>
            <td> 
                <asp:Label ID="lblRuc" runat="server" Text="Label"></asp:Label> </td>
        </tr>
        <tr>
            <td><b>Local</b></td>     
            <td>
                <asp:Label ID="lbllocal" runat="server" Text="Label"></asp:Label>
            </td>
        </tr>


        <tr >
            <td colspan="10" bgcolor="Red" ><b>Fecha y Hora de la Reserva:</b></td>
        </tr>
        <tr>
            <td width="10%"><b>Año</b></td>
            <td width="20%"> 
                <asp:DropDownList ID="cboAño" runat="server" AutoPostBack="True" 
                    onselectedindexchanged="cboAño_SelectedIndexChanged">
                    <asp:ListItem>Seleccione</asp:ListItem>
                </asp:DropDownList>
            </td>
            <td width="10%"><b>Mes</b></td>
            <td width="20%"> 
                <asp:DropDownList ID="cboMes" runat="server" AutoPostBack="True" 
                    onselectedindexchanged="cboMes_SelectedIndexChanged" DataTextField="aa">
                </asp:DropDownList>
            </td>
            
            <td width="10%"><b>Dia</b></td>
            <td width="20%"> 

                <asp:DropDownList ID="cboDia" runat="server" AutoPostBack="True" 
                    onselectedindexchanged="cboDia_SelectedIndexChanged">
                </asp:DropDownList>

            </td>
        </tr>
        <tr>
        <td><b>Hora</b></td>
            <td> 
                <asp:DropDownList ID="cboHora" runat="server">
                </asp:DropDownList>
            </td>
        </tr>
        <tr><td>
             <b>Cantidad de Personas</b></td>
            <td>
                <asp:DropDownList ID="cboCantidad" runat="server">
                    <asp:ListItem>Seleccione</asp:ListItem>
                    <asp:ListItem>2</asp:ListItem>
                    <asp:ListItem>4</asp:ListItem>
                    <asp:ListItem>6</asp:ListItem>
                    <asp:ListItem>8</asp:ListItem>
                    <asp:ListItem>10</asp:ListItem>
                </asp:DropDownList>
            </td>
            
        </tr>
        <tr><td></td></tr>
        <tr><td></td></tr>
        <tr>
        <td align="center" colspan="6"> 
            <asp:Button ID="btnBuscar" runat="server" Text="Reservar" 
                onclick="btnRegistrar_Click" ForeColor="#0033CC" />      
           
        </td>


        </tr>
        <tr>
            <td align="center" colspan="9"> <asp:Label ID="lblm" runat="server" ForeColor="#FF3300"></asp:Label></td>
        </tr>


        </table >


    </div>
    </form>
</body>
</html>
