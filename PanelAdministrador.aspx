<%@ Page Title="" Language="C#" MasterPageFile="~/Dashboard.master" AutoEventWireup="true" CodeFile="PanelAdministrador.aspx.cs" Inherits="PanelDeControl" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="dashboard-sites-space-wrapper " id="dashboard-sites-space-wrapper">
        <div id="dashboard-sites-space" data-rows="1">
            <table id="dashboard-sites-table">
                <thead>
                    <tr class=" even ">
                        <td>Panel de Control Administrador</td>
                        <td>Lecturas<a class=" has-bligoo-tooltip " data-bligoo-tooltip-text="&lt;div id=&#39;dashboard-reports-visits-number-tooltip&#39;&gt;&lt;img width=&#39;219&#39; height=&#39;52&#39; src=&#39;estilos/Dashboard/face-report-description-table.gif&#39;/&gt;&lt;p&gt;Promedio de lecturas de esta semana en relación a la semana anterior&lt;/p&gt;&lt;/div&gt;" data-bligoo-tooltip-width="300" href="javascript:void(0)" data-bligoo-tooltip-direction="vertical"> ?</a>
                            <div class="bligoo-tooltip" style="width: 300px; display: none; left: 826px; top: 113px;">
                                <div class="bligoo-tooltip-body">
                                    <div id="dashboard-reports-visits-number-tooltip">
                                        <img width="219" height="52" src="estilos/Dashboard/face-report-description-table.gif" alt="" />
                                        <p>Promedio de lecturas de esta semana en relación a la semana anterior</p>
                                    </div>
                                </div>
                                <div class="bligoo-tooltip-tip bligoo-tooltip-tip-vertical" style="background-position: 145px 0px;"></div>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr class="site-main-data site-main-data-even dashboard-sites-table-item site-main-data-over-open even " id="dash-site-345969" data-target-id="site-extra-config-345969" data-blog="345969">
                        <td class="site-url ">
                            <div class="site-row ">
                                <div class="site-basic-info ">
                                    <strong>i7exe.bligoo.com</strong>&nbsp;<a class=" site-go-link dont-open " href="#" title="Abrir este sitio en una ventana nueva">Ver &#8594;</a>
                                    <div class="clear "></div>
                                </div>
                                <div class="site-op "><a class=" dashboard-site-more-options " href="javascript:void(0)" data-target-id="site-extra-config-345969" data-blog="345969">Más opciones</a></div>
                                <div class="clear "></div>
                            </div>
                        </td>
                        <td class="site-grow-rate ">
                            <div class="clearfix dashboard-site-extra-data ">
                                <div class="float-right site-rate "><img border="0" alt="" src="estilos/Dashboard/dashboard-smile-5.gif" /><span class="green rate-percent ">+300.0%</span>&nbsp;</div>
                                <div class="site-recommendations float-left ">
                                    <div class="dashboard-recommendations-button "><a class=" dont-open " href="#">Ver reportes</a></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="site-extra-config odd ">
                        <td colspan="2">
                            <div class="dashboard-site-more-options-area " id="site-extra-config-345969" style="display: ;">
                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-pro-account ">
                                        <a class=" open-bligoo-window-link " href="MantenimientoUsuario.aspx" data-method="windowProAccount" data-name="windowproaccount" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="130" data-width="400" data-module="ContactForm">Gestionar Usuarios</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Se ha creado con el fin de realizar el mantenimiento de los usuarios del sistema.</p>
                                        <div class="dashboard-site-pro-badge  "><a href="#" target="_BLANK"></a></div>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-site-newsletter ">
                                        <a class=" open-bligoo-window-link " href="MantenimientoCliente.aspx" data-method="windowGoToNewsletter" data-name="windowgotonewsletter" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="450" data-width="400" data-module="CMR">Gestionar Clientes</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Se ha creado con el fin de realizar el mantenimiento de los cliente del sistema.</p>
                                            <div class="dashboard-site-new-badge " id="dashboard-site-new-badge-es"></div>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-site-newsletter ">
                                        <a class=" open-bligoo-window-link " href="MantenimientoPermisosClientesYUsuario.aspx" data-method="windowGoToNewsletter" data-name="windowgotonewsletter" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="450" data-width="400" data-module="CMR">Gestionar Permisos</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Se ha creado con el fin de realizar el mantenimiento de los permisos del sistema.</p>
                                            <div class="dashboard-site-new-badge " id="Div1"></div>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-domain-site ">
                                        <a class=" open-bligoo-window-link " href="ConsultarOfertas.aspx" data-method="windowDashboardDomainChange" data-name="windowdashboarddomainchange" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="350" data-width="400" data-module="Blog">Ofertas Clientes</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Consultar reportes de las ofertas que ofrecen las empresa registradas en la aplicación.</p>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-site-removeads ">
                                        <a href="ConsultarEventos.aspx">Eventos Clientes</a></div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Consultar reportes de los eventos que ofrecen los empresas registrados en la aplicación..</p>
                                        <div class="dashboard-site-pro-badge  ">
                                            <a href="#" target="_BLANK"></a>
                                        </div>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-close-site ">
                                        <a class=" open-bligoo-window-link " href="javascript:void(0)" data-method="windowSiteClose" data-name="windowsiteclose" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="130" data-width="400" data-module="Shop">Cotizaciones enviadas</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Consultar reportes de las solicitudes de cotización enviadas por los usuarios.</p>
                                        <div class="dashboard-site-pro-badge  ">
                                            <a href="#" target="_BLANK"></a>
                                        </div>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-google-apps ">
                                        <a class=" open-bligoo-window-link " href="javascript:void(0)" data-method="windowGoogleApps" data-name="windowgoogleapps" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="350" data-width="500" data-module="Shop">Cotizaciones Atendidas</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Consultar reportes de las respuestas de cotización enviadas por  las empresas.</p>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-offline-site ">
                                        <a class=" open-bligoo-window-link " href="ConsultarClienteMasVisitados.aspx" data-method="windowPutOfflineSite" data-name="windowputofflinesite" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="330" data-width="400" data-module="Blog">Clientes más Visitados</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc ">
                                        <p>Consultar reportes de las empresas más visitadas.</p>
                                    </div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-theme-edit ">
                                        <a class=" open-bligoo-window-link " href="MantenimientoComentarios.aspx" data-method="windowDashboardThemeEdit" data-name="windowdashboardthemeedit" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="120" data-width="400" data-module="Blog">Gestionar Comentarios</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc "><p>Se ha creado con el fin de realizar el mantenimiento de los comentarios de la aplicación.</p></div>
                                </div>

                                <div class="dashboard-site-extra-config-item float-left ">
                                    <div class="dashboard-site-extra-config-item-title dashboard-extra-config-theme-edit ">
                                        <a class=" open-bligoo-window-link " href="EnviarFacturaMensual.aspx" data-method="windowDashboardThemeEdit" data-name="windowdashboardthemeedit" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="120" data-width="400" data-module="Blog">Enviar Factura Mensual</a>
                                    </div>
                                    <div class="dashboard-site-extra-config-item-desc "><p>Se ha creado con el fin de enviar cada quincena la factura mensual por los servicios prestados a los clientes socios.</p></div>
                                </div>

                                <div class="clear "></div>
                                <div class="dashboard-site-extra-config-item-delete " id="dashboard-site-extra-config-item-delete"><a class=" open-bligoo-window-link " href="javascript:void(0)" data-method="windowDeleteSite" data-name="delete-site" data-parameters="{&#39;blogId&#39;:&#39;345969&#39;}" data-height="500" data-width="400" data-module="Blog">Panel de Control.</a> Zona de Administración</div>
                                <div class="clear "></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="dashboard-help-center-wrapper">
        <div id="dashboard-table-top"><div id="dashboard-table-top-inner">Centro de ayuda</div></div>
        <div id="dashboard-table-separator"></div>
        <div id="dashboard-help-content">
            <table id="help-center-table" cellpadding="0" cellspacing="0">
                <tbody>
                    <tr class=" even ">
                        <td>
                            <div class="title">Reportes, estadísticas y guías para tu web</div>
                            <div class="body"><img src="estilos/Dashboard/cayuda-1.jpg" alt="" style="float:left;height: 50px;width:50px;">Selecciona uno de los sitios de tu dashboard para ver reportes y nuevas funciones para mejorarlos. <br>Podrás conocer lo que sucede en tus sitios, ver quienes te visitan y más.</div>
                        </td>
                        
                        <td>
                            <div class="title">Consejos de Facilito para mejorar tu negocio</div>
                            <div class="body"><img src="estilos/Dashboard/cayuda-2.jpg" alt="" style="float:left;height: 50px;width:50px;">Consejos y artículos de expertos que te ayudarán a 
                                hacer más conocido tu negocio. El equipo de Facilito, a tu disposición </div>
                            <div class="link"><a href="#">Ir al Blog de Facilito »</a></div>
                        </td>
                        <td>
                            <div class="title">¿Tienes dudas o ideas? Aquí te escuchamos</div>
                            <div class="body"><img src="estilos/Dashboard/cayuda-3.jpg" alt="" style="float:left;height: 50px;width:50px;">Cocina junto a nosotros la mejor receta para 
                                crecer tu negocio. ¿Tienes dudas, ideas o comentarios? escribelas aquí</div>
                            <div class="link"><a href="#">Ir a la cocina de Facilito »</a></div>
                        </td>
                        <td>
                            <div class="title">Un completo sitio de ayuda para ti</div>
                            <div class="body"><img src="estilos/Dashboard/cayuda-4.jpg" alt="" style="float:left;height: 50px;width:50px;">Revisa preguntas frecuentes o busca información sobre un tema específico. Una completa guía de ayuda en 
                                Facilito.</div>
                            <div class="link"><a href="#">Ir al sitio de ayuda »</a></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</asp:Content>

