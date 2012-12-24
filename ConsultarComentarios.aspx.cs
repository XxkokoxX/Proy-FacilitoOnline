using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Comentario co = new Comentario();
    
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                }
                else
                {
                    GridView1.DataSource = co.listarComentarios();
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
        GridView1.DataSource = co.listarComentarios();
        GridView1.DataBind();
    }

    protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            string codusuario = e.Row.Cells[2].Text;
            GridView grilla = (GridView)e.Row.FindControl("GridView2");

            grilla.DataSource = co.listarComentariosxUsuario(codusuario);
            grilla.DataBind();
        }
    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {
        if (txtFechaInicio.Text == string.Empty || txtFechaFin.Text == string.Empty)
        {
            GridView1.DataSource = co.listarComentarios();
            GridView1.DataBind();
        }
        else
        {
            DateTime f1 = DateTime.Parse(txtFechaInicio.Text);
            DateTime f2 = DateTime.Parse(txtFechaFin.Text);

            GridView1.DataSource = co.listarComentariosxRangoDeFechas(f1, f2);
            GridView1.DataBind();
        }
    }

    protected void btnLimpiar_Click(object sender, EventArgs e)
    {
        txtFechaInicio.Text = string.Empty;
        txtFechaFin.Text = string.Empty;
    }
}