using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

public partial class ReporteEventos : System.Web.UI.Page
{

    Eventos eve = new Eventos();
    Cliente cli = new Cliente();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    //FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                    Response.Redirect("Login_Usuario.aspx");
                }
                else
                {
                    txtFechaInicio.Text = DateTime.Today.ToShortDateString();
                    txtFechaFin.Text = DateTime.Today.ToShortDateString();

                    cboCliente.DataSource = cli.listarCliente();
                    cboCliente.DataTextField = "razonSocial";
                    cboCliente.DataValueField = "membresia";
                    cboCliente.DataBind();

                    GridView1.DataSource = eve.listarEventos();
                    GridView1.DataBind();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView1.PageIndex = e.NewPageIndex;
        GridView1.DataSource = eve.listarEventos();
        GridView1.DataBind();
    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {
        GridView1.DataSource = eve.listarEventosxClient(cboCliente.SelectedValue.ToString());
        GridView1.DataBind();
    }

    protected void btnLimpiar_Click(object sender, EventArgs e)
    {
        txtFechaInicio.Text = string.Empty;
        txtFechaFin.Text = string.Empty;
    }

}