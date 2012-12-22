<%@ Page Title="" Language="C#" MasterPageFile="~/Principal.master" AutoEventWireup="true"
    CodeFile="Restaurantes_detalle.aspx.cs" Inherits="Restaurantes_detalle"  EnableEventValidation="false" Debug="true"%>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
 <!-- script para google map-->
    <script  type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
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
    
    <script type="text/javascript">
        function a() {
            myWindow = window.open("pop.aspx", "pop", 'width=500,height=300')
            myWindow.document.bgColor = "lightblue"
            myWindow.document.close()
        }
    </script>
    <script type="text/javascript">
        function a() {
                    myWindow = window.open("pop.aspx", "pop", 'width=500,height=300')
                    myWindow.document.bgColor = "lightblue"
                    myWindow.document.close()
     
        }

    </script>
    
    
    
    <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" Width="100%"
        BackColor="White" BorderColor="#CCCCCC" BorderStyle="None" BorderWidth="1px"
        CellPadding="4" ForeColor="Black" GridLines="Horizontal" onselectedindexchanged="GridView1_SelectedIndexChanged"  
       >
        <Columns>

           <asp:CommandField ButtonType="Button" 
                ShowSelectButton="True" SelectText="Reservar" />

            <asp:TemplateField ControlStyle-BorderStyle="None" FooterStyle-BorderStyle="None"
                HeaderStyle-BorderStyle="None" ItemStyle-BorderStyle="None">
                <ItemTemplate>
                    <table style="width: 100%;" class="ic_container">
                        <tr>
                            <td width="10%">
                                <div id="user-avatar">
                                    <asp:Image ID="Image1" runat="server" Height="80px" ImageUrl='<%# Eval("membresia", "img/avatar/{0}.jpg") %>'
                                        Width="80px" />
                                </div>
                            </td>
                            <td style="width: 47px">
                                <asp:Label ID="lblRazonSocial" runat="server" Style="font-weight: bold; font-size: large"
                                    Text='<%# Eval("razonSocial") %>'></asp:Label>
                                  <asp:Label ID="lblMembresia" runat="server" Text='<%# Eval("membresia") %>'></asp:Label>



                            </td>
                            <td width="50%" rowspan="7">
                            
                                <div id="map_canvas"  style="height:236px; width:99%">                             
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="10%">
                                &nbsp;
                            </td>
                            <td style="width: 47px">
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td width="10%" style="height: 25px">
                                <b>Local: </b>
                            </td>
                            <td style="width: 47px; height: 25px;">
                                <asp:Label ID="lblMunicipio" runat="server" Text='<%# Eval("municipio") %>'></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td width="10%" style="height: 25px">
                                <b>Direccion: </b>
                            </td>
                            <td style="width: 47px; height: 25px;">
                                <asp:Label ID="lblCalle" runat="server" Text='<%# Eval("calle") %>'></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td width="10%" style="height: 25px">
                                <b>Sitio Web: </b>
                            </td>
                            <td style="width: 47px; height: 25px;">
                                <a href="<%# Eval("sitioWeb") %>"><asp:Label ID="lblSitioWeb" runat="server" Text='<%# Eval("sitioWeb") %>'></asp:Label></a>
                            </td>
                        </tr>
                        <tr>
                            <td width="10%" style="height: 25px">
                                <b>Actividad: </b>
                            </td>
                            <td style="width: 47px; text-align: justify; height: 25px;">
                                <asp:Label ID="lblActividad" runat="server" Text='<%# Eval("actividadPreponderante") %>'></asp:Label>
                            </td>
                        </tr>
                        <tr>
                            <td width="10%" style="height: 24px">
                                <b>Productos: </b>
                            </td>
                            <td style="width: 47px; text-align: justify; height: 24px;">
                                <asp:Label ID="lblProductos" runat="server" Text='<%# Eval("listadoDeProductos") %>'></asp:Label>
                            </td>
                        </tr>
                    </table>
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
        <SelectedRowStyle BackColor="#CC3333" Font-Bold="True" ForeColor="White" />
        <SortedAscendingCellStyle BackColor="#F7F7F7" />
        <SortedAscendingHeaderStyle BackColor="#4B4B4B" />
        <SortedDescendingCellStyle BackColor="#E5E5E5" />
        <SortedDescendingHeaderStyle BackColor="#242121" />

        <SortedAscendingCellStyle BackColor="#F7F7F7"></SortedAscendingCellStyle>

        <SortedAscendingHeaderStyle BackColor="#4B4B4B"></SortedAscendingHeaderStyle>

        <SortedDescendingCellStyle BackColor="#E5E5E5"></SortedDescendingCellStyle>

        <SortedDescendingHeaderStyle BackColor="#242121"></SortedDescendingHeaderStyle>
    </asp:GridView>
    <asp:HiddenField ID="lblCalle" runat="server"/>
    <asp:HiddenField ID="lblMunicipio" runat="server"/>
    <asp:HiddenField ID="lblEstado" runat="server"/>
    <asp:HiddenField ID="lblPais" runat="server"/>
    <asp:HiddenField ID="lblMembresia" runat="server"/>

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
                    <asp:GridView ID="GridComentarios" runat="server" AutoGenerateColumns="False" 
                        Width="50%">
                        <Columns>
                            <asp:TemplateField>
                                <HeaderTemplate>
                                    Deja tus Comentarios...
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <table style="width:100%;" bgcolor="#A9BCF5">
                                        <tr>
                                            <td colspan="2">
                                                A <asp:Label ID="lblUsuario2" runat="server" Text='<%# Eval("nombres") %>' 
                                                    ForeColor="#0000CC"></asp:Label> le gusta esto</td>
                                        </tr>
                                        <tr>
                                            <td rowspan="2" width="50px">
                                                <div id="user-avatar">
                                                    <asp:Image ID="imgComentario1" runat="server" Height="50px" 
                                                        ImageUrl='<%# Eval("usuario", "img/avatar/{0}.jpg") %>' Width="50px" />
                                                </div>
                                            </td>
                                            <td>
                                                <b><asp:Label ID="lblUsuario" runat="server" Text='<%# Eval("nombres") %>' 
                                                    ForeColor="#0000CC"></asp:Label></b>
                                                <asp:Label ID="lblComentario" runat="server" Text='<%# Eval("comentario") %>'></asp:Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Hace aproximadamente una hora * <a href="#">Me gusta</a> *
                                                <img alt="" src="img/iconos/manitoface.png" width="20px" />
                                            </td>
                                        </tr>
                                    </table>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                    <table style="width: 50%;" bgcolor="#A9BCF5">
                        <tr>
                            <td width="84px">
                                <div id="user-avatar">
                                    <asp:Image ID="imgComentario2" runat="server" ImageUrl="~/img/avatar/Ninguno.jpg" 
                                ToolTip="Visita tu perfil en FacilitoOnline." Height="84px" Width="84px" />
                                </div>
                            </td>
                            <td><asp:TextBox ID="txtComentario" runat="server" Width="300px">Escribe un Comentario...</asp:TextBox><br />
                                <asp:Button ID="btnComentar" runat="server" Text="Enviar" Height="32px" 
                                    onclick="btnComentar_Click" Width="105px" />
                            </td>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                        </table>
                </td>
            </tr>
        </table>
</asp:Content>
