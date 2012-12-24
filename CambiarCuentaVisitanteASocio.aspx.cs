using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class MantenimientoVisitante : System.Web.UI.Page
{
    Cliente cli = new Cliente();
    DataCliente dc = new DataCliente();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            lblFechaRegistro.Text = DateTime.Today.ToShortDateString();

            cboTipoCuenta.DataSource = cli.listarTipoCliente();
            cboTipoCuenta.DataTextField = "descripcion";
            cboTipoCuenta.DataValueField = "id_tipo_cliente";
            cboTipoCuenta.DataBind();

            DataTable datosCliente = cli.buscarCliente(Context.User.Identity.Name);

            txtMembresia.Text = datosCliente.Rows[0]["membresia"].ToString();
            txtRazonSocial.Text = datosCliente.Rows[0]["razonSocial"].ToString();
            txtContacto.Text = datosCliente.Rows[0]["nombreContacto"].ToString();
            cboTipoCuenta.SelectedValue = datosCliente.Rows[0]["tipoCliente"].ToString();
        }
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        DataTable datosCliente = cli.buscarCliente(Context.User.Identity.Name);

        if (txtClave.Text == string.Empty || txtMembresia.Text == string.Empty)
        {
            lblMensaje.Text = "Por motivos de seguridad ingrese su contraseña";
            return;
        }

        if (!txtClave.Text.Equals(datosCliente.Rows[0]["clave"].ToString().Trim()))
        {
            lblMensaje.Text = "Su contraseña es incorrecta";
            return;
        }

        if (!txtConfirmacion.Text.Equals(txtClave.Text))
        {
            lblMensaje.Text = "La confirmación de contraseña no coincide";
            return;
        }

        dc.Membresia = Context.User.Identity.Name;
        dc.TipoCliente = int.Parse(cboTipoCuenta2.SelectedValue);

        cli.modficiarCuentaYPerfilDelCliente(dc);

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "Su cuenta y su perfil han sido actualizado con éxito");
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
    }
}