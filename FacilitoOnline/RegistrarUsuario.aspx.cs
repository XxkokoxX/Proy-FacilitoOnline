using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Net.Mail;
using System.Text;


public partial class Registrar : System.Web.UI.Page
{
    Usuario u = new Usuario();

    private bool Enviado;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            cboTipoCliente.DataSource = u.listarTipoUsuario();
            cboTipoCliente.DataTextField = "descripcion";
            cboTipoCliente.DataValueField = "id_tipo_usuario";
            cboTipoCliente.DataBind();
        }
    }

    protected void btnRegistrar_Click(object sender, EventArgs e)
    {
        string datos = ConvertToHtmlFile();

        DataUsuario du = new DataUsuario();

        du.Email = txtEmail.Text;
        du.Clave = txtClave.Text;
        du.Nombres = txtNombres.Text;
        du.Apellidos = txtApellidos.Text;
        du.Direccion = txtDireccion.Text;
        du.FechaDeNacimiento = DateTime.Parse(txtFechaDeNacimiento.Text);
        du.TipoDeUsuario = int.Parse(cboTipoCliente.SelectedValue);

        string msg1 = u.registrarUsuario(du);

        // Enviar correo
        try
        {
            // Instanciar Correos
            Correos Cr = new Correos();
            // Iniciallizar el msg de correo electrónico
            MailMessage mnsj = new MailMessage();
            // Establecemos el Asunto
            mnsj.Subject = "Confirmación de Cuenta FacilitoOnline";
            // Aqui el Correo de destino
            string email = txtEmail.Text;
            mnsj.To.Add(new MailAddress(email));
            // Aqui el Correo de origen
            mnsj.From = new MailAddress("web0cool@hotmail.co", "Administrador");
            // Adjuntar algún archivo
            string ruta = HttpContext.Current.Request.MapPath("~/img/iconos/gracias.gif");
            mnsj.Attachments.Add(new Attachment(ruta));
            // El contenido del mensaje
            mnsj.Body = datos;
            mnsj.IsBodyHtml = true;
            // Enviar
            Cr.MandarCorreo(mnsj);
            Enviado = true;
            // Mostrar mensaje
            string msg2 = "El Mail se ha Enviado a su correo electronico Correctamente" + " Listo!!";
            string script = @"<script type='text/javascript'> alert('{0}'); </script>";
            script = string.Format(script, msg2);
            ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
        }
        catch (Exception ex)
        {
            msg1 = ex.Message;
            string script = @"<script type='text/javascript'> alert('{0}'); </script>";
            script = string.Format(script, msg1);
            ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
        }

        lblMensaje.Text = msg1;
        btnRegistrar.Enabled = false;
    }

    public string ConvertToHtmlFile()
    {
        string myHtmlFile = "";
        
        // Obtenemos un objeto de trabajo
        StringBuilder myBuilder = new StringBuilder();
        
        myBuilder.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
        myBuilder.Append("<head>");
        myBuilder.Append("<title>");
        myBuilder.Append("Confirmación de Cuenta FacilitoOnline");
        myBuilder.Append(Guid.NewGuid().ToString());
        myBuilder.Append("</title>");
        myBuilder.Append("</head>");
        myBuilder.Append("<body>");
        myBuilder.Append("<table border='1px' cellpadding='5' cellspacing='0'");
        myBuilder.Append("style='border: solid 1px Silver; font-size: small;'>");
        myBuilder.Append("<tr>");
        myBuilder.Append("<td><img src='http://i46.tinypic.com/2e1vndk.jpg' alt='Logo' /></td>");
        myBuilder.Append("<td>Bienvenido <b>" + txtNombres.Text + " " + txtApellidos.Text + "!</b></td>");
        myBuilder.Append("</tr>");
        myBuilder.Append("<tr><td colspan='2'>Para activar tu cuenta y comenzar a utilizar los servicios de FacilitoOnline, haz clic en el siguiente link o copia directamente la dirección URL en tu navegador:</td></tr>");

        myBuilder.Append("<tr>");
        myBuilder.Append("<td colspan='2'>");
        myBuilder.Append("<a href='http://localhost:1152/FacilitoOnline/ValidarCuenta.aspx'>");
        myBuilder.Append("http://localhost:1152/FacilitoOnline/ValidarCuenta.aspx");
        myBuilder.Append("</a>");
        myBuilder.Append("</td>");
        myBuilder.Append("</tr>");

        myBuilder.Append("<tr><td colspan='2'>Ingresa el siguiente Usuario...</td></tr>");
        myBuilder.Append("<tr>");
        myBuilder.Append("<td>Usuario:</td>");
        myBuilder.Append("<td>" + txtEmail.Text+ "</td>");    
        myBuilder.Append("</tr>");

        myBuilder.Append("<tr>");
        myBuilder.Append("<td>Clave:</td>");
        myBuilder.Append("<td>" + txtClave.Text + "</td>");
        myBuilder.Append("</tr>");

        myBuilder.Append("<tr><td colspan='2'>Si tienes dudas o preguntas, puedes responder este correo. Nosotros te ayudaremos siempre :)</td></tr>");
        myBuilder.Append("<tr><td colspan='2'>-------------</td></tr>");
        myBuilder.Append("<tr><td colspan='2'>El equipo de FacilitonOnline</td></tr>");
        myBuilder.Append("<tr><td colspan='2'>No olvide descargar el archivo Adjunto</td></tr>");
        
        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");
        
        // Obtenemos el string para el return
        myHtmlFile = myBuilder.ToString();
        
        return myHtmlFile;
    }
}