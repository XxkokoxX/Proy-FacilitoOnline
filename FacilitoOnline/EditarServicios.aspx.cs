using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;
using System.Data.SqlClient;
using System.Data;

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
                    FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                }
                else
                {
                    cboCategoria.DataSource = p.cargarCategoria();
                    cboCategoria.DataTextField = "descripcion";
                    cboCategoria.DataValueField = "id";
                    cboCategoria.DataBind();
                    Cargar();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    private void Cargar()
    {
        string nombre = Server.HtmlDecode(Request.Params["nombre"]);

        DataTable dt = p.UbicarProducto(nombre);

        txtid.Text = dt.Rows[0][0].ToString();
        txtNombre.Text = dt.Rows[0][1].ToString();
        int catego = int.Parse(dt.Rows[0][2].ToString());
        //cboCategoria.SelectedIndex = catego + 1;
        cboCategoria.SelectedValue = catego.ToString();
        txtCantidad.Text = dt.Rows[0][3].ToString();
        txtPrecio.Text = dt.Rows[0][4].ToString();
        foto.ImageUrl = "ImagenxID.ashx?id=" + dt.Rows[0][0].ToString();
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            int cod = int.Parse(txtid.Text);
            string nombre = txtNombre.Text;
            int catego = cboCategoria.SelectedIndex + 1;
            int cant = int.Parse(txtCantidad.Text);
            decimal precio = decimal.Parse(txtPrecio.Text);

            byte[] imageBytes = FileUpload1.FileBytes;

            int chk;

            string file = FileUpload1.FileName;
            if (file != "") { chk = 1; }
            else { chk = 2; }

            string ms = p.Modificar(cod, nombre, catego, cant, precio, imageBytes, chk);

            lblMensaje.Text = ms;

            foto.ImageUrl = "ImagenxID.ashx?id=" + txtid.Text;

            btnGrabar.Text = "Hecho.";

            btnGrabar.Enabled = false;
            txtNombre.Enabled = false;
            cboCategoria.Enabled = false;
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