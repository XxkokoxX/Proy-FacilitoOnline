﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class CambiarContraseñaVisitante : System.Web.UI.Page
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
        }
    }

    protected void btnActualizar_Click(object sender, EventArgs e)
    {

        /*if (txtClave.Text == string.Empty)
        {
            lblMensaje.Text = "Ingrese su contraseña";
            return;
        }*/

        DataTable datosUsuario = usu.buscarUsuario(Context.User.Identity.Name);

        if(!txtClave.Text.Equals(datosUsuario.Rows[0]["contraseña"].ToString().Trim())){
            lblMensaje.Text = "Su contraseña es incorrecta";
            return;
        }

        /*if (txtNuevaClave.Text == string.Empty)
        {
            lblMensaje.Text = "Ingrese una contraseña nueva";
            return;
        }

        if (txtConfirmacion.Text == string.Empty)
        {
            lblMensaje.Text = "Confirme su nueva contraseña";
            return;
        }*/

        if (!txtNuevaClave.Text.Equals(txtConfirmacion.Text))
        {
            lblMensaje.Text = "La confirmación de contraseña no coincide";
            return;
        }

        objUsuario.TipoDeUsuario  = int.Parse(datosUsuario.Rows[0]["tipoUsuario"].ToString());

        objUsuario.Nombres= datosUsuario.Rows[0]["nombres"].ToString();
        objUsuario.Apellidos = datosUsuario.Rows[0]["apellidos"].ToString();
        objUsuario.Direccion= datosUsuario.Rows[0]["direccion"].ToString();
        objUsuario.FechaDeNacimiento= DateTime.Parse(datosUsuario.Rows[0]["fechaDeNacimiento"].ToString());
        objUsuario.Email = Context.User.Identity.Name;
        objUsuario.Clave = txtConfirmacion.Text;

        usu.registraYmodificaUsuario(objUsuario);

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "Se modificó la contraseña");
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);

        lblMensaje.Text = "Su contraseña ha sido actualizada con éxito";

        txtClave.Enabled = false;
        txtNuevaClave.Enabled = false;
        txtConfirmacion.Enabled = false;
        btnActualizar.Enabled = false;
        btnLimpiar.Enabled = false;
    }
    
    protected void btnLimpiar_Click(object sender, EventArgs e)
    {
        txtClave.Text = string.Empty;
        txtNuevaClave.Text = string.Empty;
        txtConfirmacion.Text = string.Empty;
    }
}