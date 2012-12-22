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
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
                }
                else
                {
                    Listar();
                    cboCategoria.DataSource = p.cargarCategoria();
                    cboCategoria.DataTextField = "descripcion";
                    cboCategoria.DataValueField = "id";
                    cboCategoria.DataBind();
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
        txtRuc.Text = Session["USER_NAME"].ToString();
        GridView1.DataSource = p.listarProductos(txtRuc.Text);
        GridView1.DataBind();
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        string nombre = GridView1.SelectedRow.Cells[1].Text;
        Response.Redirect("EditarServicios.aspx?nombre=" + nombre);

        btnGrabar.Text = "Grabar";
        lblMensaje.Text = "";

        btnGrabar.Enabled = true;
        btnNuevo.Enabled = false;
        FileUpload1.Enabled = true;
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        lblMensaje.Text = "";
        txtNombre.Text = "";
        txtCantidad.Text = "";
        txtPrecio.Text = "";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnGrabar.Enabled = true;
        txtNombre.Enabled = true;
        cboCategoria.Enabled = true;
        txtCantidad.Enabled = true;
        txtPrecio.Enabled = true;
        FileUpload1.Enabled = true;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            string usuario = Context.User.Identity.Name;
            string nombre = txtNombre.Text;
            int catego = cboCategoria.SelectedIndex + 1;
            int cantidad = int.Parse(txtCantidad.Text);
            decimal precio = decimal.Parse(txtPrecio.Text);
            string ruc = txtRuc.Text;
            string file = FileUpload1.FileName;

            if (file != "")
            {
                byte[] imageBytes = FileUpload1.FileBytes;

                lblMensaje.Text = p.InsertarProducto(nombre, catego, cantidad, precio, imageBytes, ruc,usuario);

                GridView1.DataSource = p.listarProductos(txtRuc.Text);
                GridView1.DataBind();

                btnGrabar.Text = "Hecho.";

                btnNuevo.Enabled = true;
                btnGrabar.Enabled = false;
                txtNombre.Enabled = false;
                cboCategoria.Enabled = false;
                txtCantidad.Enabled = false;
                txtPrecio.Enabled = false;
                FileUpload1.Enabled = false;

            }
            else
            {
                lblMensaje.Text = "Seleccione una imagen";
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
            string nom = GridView1.Rows[e.RowIndex].Cells[1].Text;

            lblMensaje.Text = p.BorrarProducto(nom);

            GridView1.DataSource = p.listarProductos(txtRuc.Text);
            GridView1.DataBind();

            txtNombre.Text = "";
            txtCantidad.Text = "";
            txtPrecio.Text = "";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;

            txtNombre.Enabled = false;
            txtCantidad.Enabled = false;
            txtPrecio.Enabled = false;
            FileUpload1.Enabled = false;
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

}