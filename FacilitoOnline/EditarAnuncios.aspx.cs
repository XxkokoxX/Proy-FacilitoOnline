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
    Anuncios a = new Anuncios();
    
    string ti;

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
                    load();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    private void load()
    {
        string titulo = Request.Params["titulo"];
        ti = titulo;

        DataTable dt = a.listarAnuncioxTitulo(titulo);

        txtCodigo.Text = dt.Rows[0][0].ToString();
        txtTitulo.Text = dt.Rows[0][1].ToString();
        txtDescripcion.Text = dt.Rows[0][2].ToString();
        figura.ImageUrl = "Imagen.ashx?titulo=" + titulo;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            int c = int.Parse(txtCodigo.Text);
            lblCodigo.Text = "cod es " + c;

            byte[] imageBytes = FileUpload1.FileBytes;

            int chk;

            string file = FileUpload1.FileName;
            if (file != "")
            {
                chk = 1;
            }
            else 
            { 
                chk = 2; 
            }

            string ms = a.Modificar(c, txtTitulo.Text, txtDescripcion.Text, imageBytes, chk);

            lblMensaje.Text = ms;

            figura.ImageUrl = "Imagen.ashx?titulo=" + txtTitulo.Text;
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }
}