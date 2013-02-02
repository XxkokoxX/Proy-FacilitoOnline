<%@ Page Language="C#" AutoEventWireup="true" CodeFile="pop.aspx.cs" Inherits="pop" Debug="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


<html xmlns="http://www.w3.org/1999/xhtml" >

<head runat="server">
    <title></title>
</head>

<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.js" type="text/javascript"></script>
 
    <script src="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.16/jquery-ui.js" type="text/javascript"></script>
 
    <link href="http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.16/themes/humanity/jquery-ui.css" rel="stylesheet" type="text/css"/>
 
 <script src="estilos/jquery-toastmessage/script/jquery.clockpick.1.2.9.js"  type="text/javascript"></script>
 <link rel="stylesheet" href="estilos/jquery-toastmessage/script/jquery.clockpick.1.2.9.css" type="text/css">

 <script type="text/javascript">

     $(function () {

         $("[id$=txthora]").clockpick({
             military: true,
             layout:'Horizontal',
             starthour: 6,
             endhour: 23,
             showminutes: false
             
         }); 


         $("[id$=Text1]").datepicker({

             dateFormat: 'dd-mm-yy',
             showAnim: 'slideDown',
             monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
             monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
             dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'],
             dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
             dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
             weekHeader: 'Sm'
             //timeFormat: 'hh:mm:00'

         });
         // $("[id$=Text1]").datepicker({ dateFormat: "dd-mm-yy" });
         //$("[id$=Text1]").datepicker();

     });
 
</script>
<style type="text/css">
.Estilo16 {
	font-size: 12px;
	color: White;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	text-decoration: none;
}
A.Estilo16:hover	{color:ffffff;text-decoration:none;}
</style>

<body style="background-image:url(estilos/jquery-toastmessage/script/fondo_madera.jpg);
-webkit-background-size: cover;
-moz-background-size: cover;
-o-background-size: cover;
background-size: cover; 
" >
    <form id="form1" runat="server">
    <div  align="center">

    <table width="100%" >
        <tr>
            <td colspan="10" class="Estilo16"> <b>Datos:</b></td>
        </tr>
        <tr>
        <td class="Estilo16">
            <b >Usuario</b>
        </td>
            <td>
                <asp:Label ID="lblmembresia" runat="server" Text="Label"></asp:Label>
                
            </td>    

        </tr>
        <tr>
            <td class="Estilo16">  <b>Ruc </b>  </td>
            <td> 
                <asp:Label ID="lblRuc" runat="server" Text="Label"></asp:Label> </td>
        </tr>
        <tr>
            <td class="Estilo16"><b>Local</b></td>     
            <td>
                <asp:Label ID="lbllocal" runat="server" Text="Label"></asp:Label>
            </td>
        </tr>


        <tr >
            <td colspan="10" class="Estilo16"  ><b>Fecha y Hora de la Reserva:</b></td>
        </tr>
        <tr>
            <td width="10%" class="Estilo16"><b>Fecha</b></td>
                        <td> 
                <asp:TextBox ID="Text1" runat="server" Width="115px"></asp:TextBox></td>
        </tr>
        <tr>
        <td class="Estilo16"><b>Hora</b></td>
            <td> 
                   <asp:TextBox ID="txthora" runat="server" Width="71px"></asp:TextBox>
            </td>
            
        </tr>
        <tr><td class="Estilo16">
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
                <td> </td>
        </tr>
        <tr>
                <td align="center" colspan="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            <asp:Button ID="btnBuscar" runat="server" Text="Reservar" 
                onclick="btnRegistrar_Click" ForeColor="#0033CC" BackColor="#CCCCFF" 
                        ToolTip="Registrar Reserva" />      
           
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
