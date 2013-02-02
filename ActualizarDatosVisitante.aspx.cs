using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class MantenimientoVisitante : System.Web.UI.Page
{
    Usuario usu = new Usuario();
    DataUsuario objUsuario = new DataUsuario();

    protected void Page_Load(object sender, EventArgs e)
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
                    DataTable datosUsuario = usu.buscarUsuario(Context.User.Identity.Name);
                    HiddenField1.Value = datosUsuario.Rows[0]["contraseña"].ToString();
                    HiddenField2.Value = datosUsuario.Rows[0]["tipoUsuario"].ToString();

                    txtNombre.Text = datosUsuario.Rows[0]["nombres"].ToString();
                    txtApellido.Text = datosUsuario.Rows[0]["apellidos"].ToString();
                    txtDireccion.Text = datosUsuario.Rows[0]["direccion"].ToString();
                    txtFecNac.Text = datosUsuario.Rows[0]["fechaDeNacimiento"].ToString();
                }
            
        }
    }

    protected void btnActualizar_Click(object sender, EventArgs e)
    {
        objUsuario.Email = Context.User.Identity.Name;
        objUsuario.Nombres = txtNombre.Text;
        objUsuario.Clave = HiddenField1.Value.ToString();
        objUsuario.TipoDeUsuario = int.Parse(HiddenField2.Value.ToString());
        objUsuario.Apellidos = txtApellido.Text;
        objUsuario.Direccion = txtDireccion.Text;
        objUsuario.FechaDeNacimiento = DateTime.Parse(txtFecNac.Text);

        usu.registraYmodificaUsuario(objUsuario);

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "Se han modificado los datos correctamente");
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);

        lblMensaje.Text = "Se ha actualizado sus datos personales con éxito";

        txtNombre.Enabled = false;
        txtApellido.Enabled = false;
        txtDireccion.Enabled = false;
        txtFecNac.Enabled = false;
        btnActualizar.Enabled = false;
        btnLimpiar.Enabled = false;

    }

    protected void btnLimpiar_Click(object sender, EventArgs e)
    {
        txtNombre.Text = string.Empty;
        txtApellido.Text = string.Empty;
        txtDireccion.Text = string.Empty;
        txtFecNac.Text = string.Empty;
    }
}