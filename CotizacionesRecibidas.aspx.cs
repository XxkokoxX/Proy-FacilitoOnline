using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CotizacionesRecibidas : System.Web.UI.Page
{
    Cotizacion cot = new Cotizacion();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            GridView1.DataSource = cot.listarCotizacionesRecibidas(Context.User.Identity.Name);
            GridView1.DataBind();
        }        
    }
}