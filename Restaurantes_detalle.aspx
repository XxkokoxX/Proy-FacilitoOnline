<%@ Page Title="" Language="C#" MasterPageFile="~/Principal.master" AutoEventWireup="true"
    CodeFile="Restaurantes_detalle.aspx.cs" Inherits="Restaurantes_detalle"  EnableEventValidation="false" Debug="true"%>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <!-- script para google map-->
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" >
        var geocoder;
        var map;
        function initialize(calle, muni, d, p) {
            var address = calle + " " + muni;
            var dpto = d;
            var pais = p;
            geocoder = new google.maps.Geocoder();    

            address = address + " " + dpto + " " + pais;
            var latlng = new google.maps.LatLng(-12.122294023071484, -77.02840379999998);

            var mapOptions = {
                zoom: 15,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            geocoder.geocode({ "address": address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("La Gelocalizacion no fue exitosa, estatus: " + status);
                }
            });

            
        }

        function codeAddress(calle,muni,d,p) {
            var address = calle + " " + muni;
            var dpto = d;
            var pais = p;

            address = address + " " + dpto + " " + pais;

            geocoder.geocode({ "address": address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("La Gelocalizacion no fue exitosa, estatus: " + status);
                }
            });
        }

    </script>
    <!-- Script POP-UP -->
    <script type="text/javascript">
        function a() {
            myWindow = window.open("pop.aspx", "pop", 'width=500,height=300')
            myWindow.document.bgColor = "lightblue"
            myWindow.document.close()
        }
    </script> 
    <!-- Script limpiar celda al dar click -->
    <script type="text/javascript">
        function LimpiarTexto(txt) {
            txt.value = "";
        }
    </script>
    
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" Width="100%"
        BackColor="White" BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px"
        CellPadding="4" ForeColor="Black" GridLines="Horizontal" 
        CssClass="ic_container" ShowHeader="False" PageSize="1" onrowdatabound="GridView1_RowDataBound"  
       >
        <Columns>

            <asp:TemplateField ControlStyle-BorderStyle="None" FooterStyle-BorderStyle="None"
                HeaderStyle-BorderStyle="None" ItemStyle-BorderStyle="None" 
                HeaderText="Descripción">
                <ItemTemplate>
                    <table style="width: 100%;">
                        <tr>
                            <td>
                                <a>
                                <h4>
                                    Zona para realizar tus Reservas Online</h4>
                                </a></td>
                            <td width="50%">
                                <asp:Label ID="lblMembresia" runat="server" Text='<%# Eval("membresia") %>' 
                                    Visible="False"></asp:Label>
                                <asp:Label ID="lblCiudad" runat="server" Text='<%# Eval("ciudad") %>' 
                                    Visible="False"></asp:Label>
                                <asp:Button ID="btnReservar" runat="server" onclick="btnReservar_Click" 
                                    Text="Click Aquí para realizar tu reserva" CssClass="blue button" />
                            </td>
                            <td width="20%">
                                &nbsp;</td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                
                                <table style="width:100%;">
                                    <tr>
                                        <td width="10%">
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div ID="user-avatar">
                                                <asp:Image ID="Image1" runat="server" Height="90px" 
                                                    ImageUrl='<%# Eval("membresia", "img/avatar/{0}.jpg") %>' Width="150px" />
                                            </div>
                                        </td>
                                        <td style="font-weight: bold; font-size: x-large">
                                            <asp:Label ID="lblTitulo" runat="server" Text='<%# Eval("razonSocial") %>'></asp:Label>
                                        </td>
                                        <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 713px">
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                </table>
                                
                            </td>
                            <td width="20%">
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;</td>
                            <td width="50%">
                                &nbsp;</td>
                            <td width="20%">
                                &nbsp;</td>
                        </tr>
                        <tr>
                            <td valign="top">
                                <table style="width:100%;" class="ic_container">
                                    <tr>
                                        <td colspan="3">
                                            <img alt="" src="img/salones/01.jpg" 
                                            style="width: 230px; height: 200px" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img alt="" src="img/salones/01.jpg" 
                                            style="width: 50px; height: 50px" />
                                        </td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">Tipo de Comida</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <asp:Label ID="lblTipoComida" runat="server" 
                                                Text='<%# Eval("listadoDeProductos") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">Tipo de Local</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <img alt="" src="img/iconos/tipoRestaurante.png" 
                            style="width: 83px; height: 82px" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">Precios</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3"><a href="#">S/. 20 - S/. 40</a></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">Sitio Web</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <a href='<%# Eval("sitioWeb") %>'>
                                            <asp:Label ID="lblSitioWeb" runat="server" Text='<%# Eval("sitioWeb") %>'></asp:Label>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">
                                            Forma de Pago</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <img alt="" src="img/pagos/americaexpress.png" 
                            style="width: 66px; height: 43px" title="American Express" />
                                            <img alt="" 
                            src="img/pagos/dinners.png" style="width: 66px; height: 43px" title="Dinners" />
                                            <img alt="" src="img/pagos/mastercad.png" 
                            style="width: 66px; height: 43px" title="Mastercards" />
                                            <img alt="" src="img/pagos/efectivo.png" 
                            style="width: 66px; height: 43px" />
                                            <img alt="" 
                            src="img/pagos/visa.png" style="width: 66px; height: 44px" title="Visa" />
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td valign="top">
                                <table style="width:100%;" class="ic_container">
                                    <tr>
                                        <td colspan="3">
                                            <asp:Label ID="lblRazonSocial" runat="server" 
                                                Style="font-weight: bold; font-size: large" 
                                                Text='<%# Eval("razonSocial") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <asp:Label ID="lblActividad" runat="server" 
                                                Text='<%# Eval("actividadPreponderante") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">Ubicación</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <asp:Label ID="lblCalle" runat="server" Text='<%# Eval("calle") %>'></asp:Label><br />
                                            <asp:Label ID="lblMunicipio" runat="server" Text='<%# Eval("municipio") %>'></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <div ID="map_canvas" style="height:245px; width:99%">
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                        <td align="right"><a>Imprimir Mapa</a><img src="img/iconos/impre.png" style="height: 20px" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">
                                            Contacto</td>
                                    </tr>
                                    <tr>
                                        <td><img src="img/iconos/celu.png" /><a>(51-1)3647010</a></td>
                                        <td>
                                            &nbsp;</td>
                                        <td>
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">
                                            Email</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <img src="img/iconos/car.png" /><a href="#">elsotano.restaurante@gmail.com</a></td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="font-weight: bold; font-size: large">
                                            Servicios</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            <table style="width:100%;">
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Reservas</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Estacionamiento</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Delivery</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Bar</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Eventos</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Ofertas - Promociones</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Cotizaciones</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Plato a la Carta</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Menú Ejecutivo</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Menú para niños</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Música de fondo</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Silla para bebés</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 23px">
                                                        <img alt="" src="img/iconos/buena.png" 
                                                        style="width: 14px; height: 11px" />
                                                    </td>
                                                    <td>
                                                        Wi-Fi</td>
                                                    <td>
                                                        &nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            &nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                            <td valign="top">
                                <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False" 
                                    >
                                    <Columns>
                                        <asp:TemplateField HeaderText="Restaurantes Similares">
                                            <ItemTemplate>
                                                <table style="width:100%;" class="ic_container">
                                                    <tr>
                                                        <td>
                                                            &nbsp;</td>
                                                        <td>
                                                            &nbsp;</td>
                                                        <td>
                                                            &nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td rowspan="2" width="80px" >
                                                            
                                                            <div ID="user-avatar">
                                                                <asp:Image ID="imageRS" runat="server" Height="80px" 
                                                                    ImageUrl='<%# Eval("membresia", "img/avatar/{0}.jpg") %>' Width="80px" />
                                                            </div>
                                                            
                                                        </td>
                                                        <td colspan="2">
                                                            <b><asp:Label ID="lblRazonSocialRS" runat="server" 
                                                                Text='<%# Bind("razonSocial") %>'></asp:Label></b>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <asp:Label ID="lblCiudadRS" runat="server" Text='<%# Bind("ciudad") %>'></asp:Label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            &nbsp;</td>
                                                        <td>
                                                            &nbsp;</td>
                                                        <td>
                                                            &nbsp;</td>
                                                    </tr>
                                                </table>
                                            </ItemTemplate>
                                            <EditItemTemplate>
                                                <asp:TextBox ID="TextBox1" runat="server" Text='<%# Bind("razonSocial") %>'></asp:TextBox>
                                            </EditItemTemplate>
                                        </asp:TemplateField>
                                    </Columns>
                                </asp:GridView>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                            <td>
                                &nbsp;
                            </td>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                    </table>
                    <br /><br />
                </ItemTemplate>
                <ControlStyle BorderStyle="None"></ControlStyle>
                <FooterStyle BorderStyle="None"></FooterStyle>
                <HeaderStyle BorderStyle="None"></HeaderStyle>
                <ItemStyle BorderStyle="None"></ItemStyle>
            </asp:TemplateField>

        </Columns>
        <FooterStyle BackColor="#CCCC99" ForeColor="Black" />
        <HeaderStyle BackColor="#333333" Font-Bold="True" ForeColor="White" />
        <PagerStyle BackColor="White" ForeColor="Black" HorizontalAlign="Right" />
        <SelectedRowStyle Font-Bold="True" />
        <SortedAscendingCellStyle BackColor="#F7F7F7" />
        <SortedAscendingHeaderStyle BackColor="#4B4B4B" />
        <SortedDescendingCellStyle BackColor="#E5E5E5" />
        <SortedDescendingHeaderStyle BackColor="#242121" />

    </asp:GridView>
    <asp:HiddenField ID="lblCalle" runat="server"/>
    <asp:HiddenField ID="lblMunicipio" runat="server"/>
    <asp:HiddenField ID="lblEstado" runat="server"/>
    <asp:HiddenField ID="lblPais" runat="server"/>
    

    <table style="width:100%;">
            <tr>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
                <td>
                    &nbsp;</td>
            </tr>
            <tr>
                <td colspan="3">
                    <asp:Label ID="lblCache" runat="server" Text="Label"></asp:Label>
                </td>
            </tr>
            <tr>
                <td colspan="3">
                    <table style="width: 50%;" bgcolor="#A9BCF5">
                        <tr>
                            <td width="84px" rowspan="2">
                                <div id="user-avatar">
                                    <asp:Image ID="imgComentario1" runat="server" ImageUrl="~/img/avatar/Ninguno.jpg" 
                                ToolTip="Visita tu perfil en FacilitoOnline." Height="84px" Width="84px" />
                                </div>
                            </td>
                            <td colspan="4">
                                <asp:TextBox ID="txtComentario" runat="server" Width="370px" 
                                    ToolTip="Escribe un Comentario..." ForeColor="Gray" Height="70px" 
                                    TextMode="MultiLine">Escribe un Comentario...</asp:TextBox><br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="lblMensaje" runat="server" CssClass="failureNotification"></asp:Label>
                            </td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td align="right">
                                <asp:Button ID="btnComentar" runat="server" Height="32px" 
                                    onclick="btnComentar_Click" Text="Publicar" Width="105px" />
                            </td>
                        </tr>
                    </table>
                    <asp:GridView ID="GridComentarios" runat="server" AutoGenerateColumns="False" 
                        Width="50%" onrowdatabound="GridComentarios_RowDataBound" 
                        ShowHeader="False">
                        <Columns>
                            <asp:TemplateField>
                                <HeaderTemplate>
                                    Deja tus Comentarios...
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <table style="width:100%;">
                                        <tr>
                                            <td colspan="2">
                                                A <asp:Label ID="lblUsuarioComentario1" runat="server" Text='<%# Eval("nombres") %>' 
                                                    ForeColor="#0000CC"></asp:Label> le gusta esto</td>
                                        </tr>
                                        <tr>
                                            <td width="50px" rowspan="2">
                                                <div ID="user-avatar">
                                                    <asp:Image ID="imgComentario2" runat="server" Height="50px" 
                                                        ImageUrl='<%# Eval("usuario", "img/avatar/{0}.jpg") %>' Width="50px" />
                                                </div>
                                            </td>
                                            <td>
                                                <b><asp:Label ID="lblUsuario" runat="server" Text='<%# Eval("nombres") %>' 
                                                    ForeColor="#0000CC"></asp:Label></b>
                                                <asp:Label ID="lblIdComentario" runat="server" Text='<%# Eval("id") %>' 
                                                    Visible="False"></asp:Label>
                                                
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <asp:Label ID="lblComentario" runat="server" Text='<%# Eval("comentario") %>'></asp:Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50px" style="height: 18px"></td>
                                            <td style="height: 18px"><a>Me gusta</a>  * Hace 2 horas *
                                                <img alt="" src="img/iconos/manitoface.png" width="15px" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50px">
                                                &nbsp;</td>
                                            <td>
                                                <asp:GridView ID="GridSubComentario" runat="server" AutoGenerateColumns="False" 
                                                    Width="100%" ShowHeader="False">
                                                    <Columns>
                                                        <asp:TemplateField>
                                                            <HeaderTemplate>
                                                                SubComentar
                                                            </HeaderTemplate>
                                                            <ItemTemplate>
                                                                <table style="width:100%;">
                                                                    <tr>
                                                                        <td colspan="2">
                                                                            A
                                                                            <asp:Label ID="lblUsuarioSubComentario1" runat="server" ForeColor="Blue" 
                                                                                Text='<%# Eval("nombreCompleto") %>'></asp:Label>
                                                                            le gusta esto</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td width="30px">
                                                                            <div id="user-avatar">
                                                                                <asp:Image ID="imgSubComentario1" runat="server" Height="30px" 
                                                                                    ImageUrl='<%# Eval("usuario", "img/avatar/{0}.jpg") %>' Width="30px" />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <b>
                                                                            <asp:Label ID="lblUsuarioSubComentario2" runat="server" ForeColor="Blue" 
                                                                                Text='<%# Eval("nombreCompleto") %>'></asp:Label>
                                                                            </b>
                                                                            <asp:Label ID="lblIdSubComentario" runat="server" Text='<%# Eval("id") %>' 
                                                                                Visible="False"></asp:Label>
                                                                            <asp:Label ID="lblSubComentario" runat="server" 
                                                                                Text='<%# Eval("subComentario") %>'></asp:Label>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td width="30px">
                                                                            &nbsp;</td>
                                                                        <td>
                                                                            Hace 2 horas * <a>Me gusta</a>
                                                                            <img alt="" src="img/iconos/manitoface.png" width="15px" />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </ItemTemplate>
                                                        </asp:TemplateField>
                                                    </Columns>
                                                    <EditRowStyle BorderStyle="None" />
                                                    <FooterStyle BorderStyle="None" />
                                                    <HeaderStyle BorderStyle="None" />
                                                    <RowStyle BorderStyle="None" />
                                                </asp:GridView>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="50px">&nbsp;</td>
                                            <td bgcolor="#E0ECF8">
                                                <table style="width: 100%;">
                                                    <tr>
                                                        <td  Width="30px">
                                                            <div id="user-avatar">
                                                                <asp:Image ID="imgSubComentario2" runat="server" ImageUrl="~/img/avatar/Ninguno.jpg" 
                                                                ToolTip="Visita tu perfil en FacilitoOnline."  Height="30px" Width="30px" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            &nbsp; &nbsp;
                                                            <asp:TextBox ID="txtSubComentario" runat="server" ForeColor="Gray" 
                                                                ToolTip="Escribe un Comentario..." Width="300px">Escribe un Comentario...</asp:TextBox>
                                                            <asp:Button ID="btnSubComentar" runat="server" onclick="btnSubComentar_Click" 
                                                                Text="Publicar" />
                                                            <asp:Label ID="lblMensaje1" runat="server" CssClass="failureNotification"></asp:Label>
                                                        </td>
                                                    </tr>
                                                </table>     
                                            </td>
                                        </tr>
                                    </table>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </td>
            </tr>
        </table>
        <asp:HiddenField ID="lblMembresia" runat="server"/>
</asp:Content>
