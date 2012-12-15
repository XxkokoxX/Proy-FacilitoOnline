using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.Web.Security;

public partial class Login_Usuario : System.Web.UI.Page
{
    Conexion cn = new Conexion();

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void btnIngresar_Click(object sender, EventArgs e)
    {
        if (fnLogin(txtEmail.Text, txtContraseña.Text))
        {
            // Administramos los servicios de autenticación de usuario y 
            // redireccionamos al defaultUrl definido en Web,config           
            FormsAuthentication.RedirectFromLoginPage(txtEmail.Text, chkRecordar.Checked);
        }
    }
    
    private bool fnLogin(string prmUserLogin, string prmPassword)
    {
        bool _return = false;
        try
        {
            cn.getCn.Open();
            SqlCommand cmd = new SqlCommand("USP_USUARIO_LOGIN", cn.getCn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter paramUsuario = cmd.Parameters.Add("@USER_LOGIN", SqlDbType.NVarChar, 50);
            SqlParameter paramContraseña = cmd.Parameters.Add("@USER_PASSWORD", SqlDbType.NVarChar, 50);
            paramUsuario.Value = prmUserLogin;
            paramContraseña.Value = prmPassword;
            SqlDataReader drLogin = cmd.ExecuteReader();
            if (drLogin.Read())
            {
                Session.Add("USER_NAME", drLogin["nombres"].ToString());
                _return = true;
            }
            else
            {
                lblMensaje1.Text = "Nombre de usuario o contraseña incorrectos";
                _return = false;
            }
            drLogin.Close();
            cn.getCn.Close();
            return (_return);
        }
        catch (Exception ex)
        {
            lblMensaje1.Text = ex.Message;
            return (false);
        }
    }
}