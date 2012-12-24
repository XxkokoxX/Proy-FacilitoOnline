using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Producto p = new Producto();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            //txtUsu.Text = Context.User.Identity.Name;
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                }
                else
                {
                    Listar();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    private void Listar()
    {
        GridView1.DataSource = p.cargarCategoria();
        GridView1.DataBind();
    }

    protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView1.PageIndex = e.NewPageIndex;
        GridView1.DataSource = p.cargarCategoria();
        GridView1.DataBind();
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            string nom = GridView1.Rows[e.RowIndex].Cells[1].Text;
            lblMensaje.Text = p.BorrarCategoria(nom);
            Listar();
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_RowEditing(object sender, GridViewEditEventArgs e)
    {
        GridView1.EditIndex = e.NewEditIndex;
        Listar();
    }

    protected void GridView1_RowUpdating(object sender, GridViewUpdateEventArgs e)
    {
        GridViewRow row = GridView1.Rows[e.RowIndex];
        TextBox nombrecat = GridView1.Rows[e.RowIndex].Cells[2].Controls[0] as TextBox;
        string cod = GridView1.Rows[e.RowIndex].Cells[1].Text;

        lblMensaje.Text = p.ModificarCtegoria(cod, nombrecat.Text);

        GridView1.EditIndex = -1;
        Listar();
    }

    protected void GridView1_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
    {
        GridView1.EditIndex = -1;
        Listar();
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        txtCategoria.Text = "";
        lblMensaje.Text = "";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnGrabar.Enabled = true;
        txtCategoria.Enabled = true;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {

            p.agregarCategoria(txtCategoria.Text);
            Listar();

            btnGrabar.Text = "Hecho.";
            txtCategoria.Text = "";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;
            txtCategoria.Enabled = false;
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

}