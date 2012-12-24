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
    DataComentario dc = new DataComentario();
    
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
                    GridView1.DataSource = co.listarComentarios1();
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
        GridView1.DataSource = co.listarComentarios1();
        GridView1.DataBind();
    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {
        if (txtFechaInicio.Text == string.Empty || txtFechaFin.Text == string.Empty)
        {
            GridView1.DataSource = co.listarComentarios1();
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

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtIdComentario.Text = GridView1.SelectedRow.Cells[1].Text;
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        if (txtIdComentario.Text == string.Empty)
        {
            lblMensaje.Text = "Porfavor Seleccione una fila";
            return;
        }

        dc.Id = int.Parse( txtIdComentario.Text);

        co.eliminarComentario(dc);

        string usuario = GridView1.Rows[0].Cells[4].Text;

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "Se ha eliminado el comentario realizado por el usuario " + usuario);
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);

        co.listarComentarios1();
    }

}