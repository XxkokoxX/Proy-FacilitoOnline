using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ValidarCuenta : System.Web.UI.Page
{
    Permisos p = new Permisos();

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnValidar_Click(object sender, EventArgs e)
    {
        DataPermiso cp = new DataPermiso();

        cp.Cliente_O_Usuario = txtUsuario.Text;
        /*cp.Activo = chkActivo.Checked;
        cp.Administrador = chkAdministrador.Checked;
        cp.Visitante = chkVisitante.Checked;
        cp.ClienteSocio = chkSocio.Checked;
        cp.ClienteInvitado = chkInvitado.Checked;*/

        string msg = p.registrarPermisoClienteYUsuarios(cp);

        /*string script = @"<script type='text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, msg);
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);*/

        // Mostrar mensaje y retornar
        string script = @"<script type='text/javascript'>
                                    alert('{0}');
                                    window.location = 'Restaurantes.aspx';
                          </script>";
        script = string.Format(script, msg);
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);

        txtUsuario.Text = "";
        btnValidar.Enabled = false;

    }

}