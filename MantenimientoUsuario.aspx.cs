using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Usuario u = new Usuario();

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
                    cboTipoUsuario.DataSource = u.listarTiposDeUsuarios();
                    cboTipoUsuario.DataTextField = "descripcion";
                    cboTipoUsuario.DataValueField = "id_tipo_usuario";
                    cboTipoUsuario.DataBind();

                    GridView1.DataSource = u.listarUsuario();
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
        GridView1.DataSource = u.listarUsuario();
        GridView1.DataBind();
    }

    protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {

            string KeyID1 = GridView1.DataKeys[e.Row.RowIndex].Values[0].ToString();
            System.Web.UI.WebControls.Image imagen1 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image2");

            if (int.Parse(KeyID1) == 1)
            {
                imagen1.ImageUrl = "img/iconos/adm.png";
            }
            else
            {
                imagen1.ImageUrl = "img/iconos/usu.png";
            }
        }
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            int f = GridView1.SelectedIndex;

            string tipoUsuario = (GridView1.Rows[f].Cells[7].FindControl("lblTipoUsuario") as Label).Text;

            txtEmail.Text = GridView1.SelectedRow.Cells[1].Text;
            txtContraseña.Text = GridView1.SelectedRow.Cells[2].Text;
            txtNombres.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[3].Text);
            txtApellidos.Text = Server.HtmlDecode( GridView1.SelectedRow.Cells[4].Text);
            txtDireccion.Text = Server.HtmlDecode( GridView1.SelectedRow.Cells[5].Text);
            DateTime fn = DateTime.Parse(GridView1.SelectedRow.Cells[6].Text);
            txtFechaDeNacimiento.Text = fn.ToShortDateString();
            cboTipoUsuario.Text = tipoUsuario;
            lblFechaRegistro.Text = GridView1.SelectedRow.Cells[8].Text;
            
            btnGrabar.Text = "Grabar";
            lblMensaje.Text = "";

            btnGrabar.Enabled = true;
            btnNuevo.Enabled = false;
            txtEmail.Enabled = false;
            txtContraseña.Enabled = false;
            txtNombres.Enabled = true;
            txtApellidos.Enabled = true;
            txtDireccion.Enabled = true;
            txtFechaDeNacimiento.Enabled = true;
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
        lblMensaje.Text = "";
        txtEmail.Text = "";
        txtContraseña.Text = "";
        txtNombres.Text = "";
        txtApellidos.Text = "";
        txtDireccion.Text = "";
        txtFechaDeNacimiento.Text = "dd/mm/aaaa";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnGrabar.Enabled = true;
        txtEmail.Enabled = true;
        txtContraseña.Enabled = true;
        txtNombres.Enabled = true;
        txtApellidos.Enabled = true;
        txtDireccion.Enabled = true;
        cboTipoUsuario.Enabled = true;
        txtFechaDeNacimiento.Enabled = true;
        FileUpload1.Enabled = true;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            DataUsuario du = new DataUsuario();

            du.Email = txtEmail.Text;
            du.Clave = txtContraseña.Text;
            du.Nombres = txtNombres.Text;
            du.Apellidos = txtApellidos.Text;
            du.Direccion = txtDireccion.Text;
            du.FechaDeNacimiento = DateTime.Parse(txtFechaDeNacimiento.Text);
            du.TipoDeUsuario = int.Parse(cboTipoUsuario.SelectedValue);

            string msg = u.registraYmodificaUsuario(du);
            lblMensaje.Text = msg;

            GridView1.DataSource = u.listarUsuario();
            GridView1.DataBind();

            btnGrabar.Text = "Hecho.";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;
            txtNombres.Enabled = false;
            txtApellidos.Enabled = false;
            txtDireccion.Enabled = false;
            txtFechaDeNacimiento.Enabled = false;
            FileUpload1.Enabled = false;
            
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
            DataUsuario du = new DataUsuario();

            du.Email = txtEmail.Text;

            string msg = u.eliminarUsuario(du);
            lblMensaje.Text = msg;

            GridView1.DataSource = u.listarUsuario();
            GridView1.DataBind();

            txtEmail.Text = "";
            txtContraseña.Text = "";
            txtNombres.Text = "";
            txtApellidos.Text = "";
            txtDireccion.Text = "";
            txtFechaDeNacimiento.Text = "";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;

            txtEmail.Enabled = false;
            txtContraseña.Enabled = false;
            txtNombres.Enabled = false;
            txtApellidos.Enabled = false;
            txtDireccion.Enabled = false;
            txtFechaDeNacimiento.Enabled = false;
            FileUpload1.Enabled = false;
            
        }
        catch (Exception)
        {
            lblMensaje.Text = "Porfavor seleccione un registro de la tabla.";
        }
    }
}