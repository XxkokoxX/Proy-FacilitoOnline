using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
        if (!IsPostBack)
        {
            if (Context.User.Identity.IsAuthenticated)
            {
                //lblFecha.Text = Session["USER_NAME"].ToString() + " - " + DateTime.Today.ToShortDateString();
                lblFecha.Text = " Bienvenido Sr@ - Fecha de Ingreso en la aplicación - " + DateTime.Today.ToShortDateString();
            }
            else
            {
                Response.Redirect("Restaurantes.aspx");
                /*string script = @"<script type='text/javascript'>
                                    alert('Para consultar su perfil de usuario debe iniciar sesión en la aplicación.');
                                    window.location = 'Inicio.aspx';
                                  </script>";
                ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false) ;*/
            }
            
        }

    }
}