using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.Security;

public partial class ReporteOfertas : System.Web.UI.Page
{
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
                    cboCliente.DataSource = cli.listarCliente();
                    cboCliente.DataTextField = "razonSocial";
                    cboCliente.DataValueField = "membresia";
                    cboCliente.DataBind();

                    GridView1.DataSource = cli.listarClienteMasVistos();
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
        GridView1.DataSource = cli.listarClienteMasVistos();
        GridView1.DataBind();
    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {
        GridView1.DataSource = cli.BuscarClienteMasVistos(cboCliente.SelectedValue.ToString());
        GridView1.DataBind();
    }
}