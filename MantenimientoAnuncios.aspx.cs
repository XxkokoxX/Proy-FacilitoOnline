using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Anuncios a = new Anuncios();

    string ruc;

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
                    listar();
                    txtRazonSocial.Text = Session["USER_NAME"].ToString();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    private void listar()
    {
        GridView1.DataSource = a.listarAnuncios();
        GridView1.DataBind();
    }

    protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView1.PageIndex = e.NewPageIndex;
        GridView1.DataSource = a.listarAnuncios();
        GridView1.DataBind();
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            string titulo = GridView1.SelectedRow.Cells[1].Text;
            Response.Redirect("EditarAnuncios.aspx?titulo=" + titulo);
            
            btnGrabar.Text = "Grabar";
            //lblMensaje.Text = "";

            btnGrabar.Enabled = true;
            btnNuevo.Enabled = false;
            txtTitulo.Enabled = false;
            txtRazonSocial.Enabled = false;
            txtDescripcion.Enabled = true;
            FileUpload1.Enabled = true;

        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        txtTitulo.Text = "";
        txtDescripcion.Text = "";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnGrabar.Enabled = true;
        txtTitulo.Enabled = true;
        txtDescripcion.Enabled = true;
        FileUpload1.Enabled = true;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {

            string file = FileUpload1.FileName;

            if (file != "")
            {
                byte[] imageBytes = FileUpload1.FileBytes;
                string ms = a.Insertar(txtTitulo.Text, txtDescripcion.Text, imageBytes, txtRazonSocial.Text);

                lblMensaje.Text = ms;
                listar();

                btnGrabar.Text = "Hecho.";

                btnNuevo.Enabled = true;
                btnGrabar.Enabled = false;
                txtTitulo.Enabled = false;
                txtRazonSocial.Enabled = false;
                txtDescripcion.Enabled = false;
                FileUpload1.Enabled = false;
            }
            else
            {
                lblMensaje.Text = "Porfavor Seleccione un archivo";
            }

        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            string titulo = GridView1.Rows[e.RowIndex].Cells[1].Text;
            lblMensaje.Text = a.Borrar(titulo);
            GridView1.DataSource = a.listarAnuncios();
            GridView1.DataBind();

            txtTitulo.Text = "";
            txtDescripcion.Text = "";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;

            txtTitulo.Enabled = false;
            txtDescripcion.Enabled = false;
            FileUpload1.Enabled = false;
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }
}