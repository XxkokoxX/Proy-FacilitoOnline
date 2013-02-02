using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;
using System.Text;

using System.Web.Security;
public partial class pop : System.Web.UI.Page
{

    Reserva r = new Reserva();
    
    protected void Page_Load(object sender, EventArgs e)
    {

        lblmembresia.Text = Context.User.Identity.Name;
        lbllocal.Text = Request.Cookies["dato"].Values["local"];
        lblRuc.Text = Request.Cookies["dato"].Values["ruc"];
        if(!Page.IsPostBack){

        //cargarCombo();
        
        }
    }


    protected void btnRegistrar_Click(object sender, EventArgs e)
    {

        if (Text1.Text==""||cboCantidad.SelectedIndex==0||txthora.Text=="")
        {
            lblm.Text = "Por favor llene todos los datos";
        }
        else {

        string ruc = lblRuc.Text;
        string local = lbllocal.Text;
        //string dia = cboDia.SelectedValue.ToString();
        //string mes = cboMes.SelectedValue.ToString();
        //string año = cboAño.SelectedValue.ToString();
        int hora = int.Parse(txthora.Text.Substring(0,2));
        string fecha = Text1.Text;
        int cantidad=int.Parse( cboCantidad.SelectedValue);
        string usuario = Context.User.Identity.Name;
        string fecha_reg= DateTime.Now.Day+"/"+DateTime.Now.Month+"/"+DateTime.Now.Year;

       

        lblm.Text = r.RegistrarReserva(ruc,local,fecha,hora,cantidad,usuario,fecha_reg);

        string correo = Context.User.Identity.Name;
        
        EnviarCorreo(correo,fecha,usuario);

        Response.Write("<script language='javascript'>alert('" + lblm.Text+ " .');</script>");

        if (Page.IsPostBack) {

            Response.Write("<script>window.close();</script>");
        }      

       

        }
    }


    public string ConvertToHtmlFile(string correo,string fecha,string usuario)
    {
        string myHtmlFile = "";


        // Obtenemos un objeto de trabajo
        StringBuilder myBuilder = new StringBuilder();

        myBuilder.Append("<html xmlns='http://www.w3.org/1999/xhtml'>");
        myBuilder.Append("<head>");
        myBuilder.Append("<title>");
        myBuilder.Append("Constancia de Reserva ");
        myBuilder.Append(Guid.NewGuid().ToString());
        myBuilder.Append("</title>");
        myBuilder.Append("</head>");
        myBuilder.Append("<body>");
        myBuilder.Append("<table border='1px' cellpadding='5' cellspacing='0'");
        myBuilder.Append("style='border: solid 1px Silver; font-size: small;'>");
        myBuilder.Append("<tr>");
        myBuilder.Append("<td><img src='http://i46.tinypic.com/2e1vndk.jpg' alt='Logo' /></td>");
        myBuilder.Append("<td>Bienvenido <b>" + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + "!</b></td>");
        myBuilder.Append("</tr>");


        myBuilder.Append("<tr><td colspan='2'>Saludos </td></tr>");
        myBuilder.Append("<tr>");
        myBuilder.Append("<td>Usuario:</td>");
        myBuilder.Append("<td>" + usuario + "</td>");
        myBuilder.Append("</tr>");

        myBuilder.Append("<tr>");
        myBuilder.Append("<td>Su reserva ha sido procesada para el dia:</td>");
        myBuilder.Append("<td>" + fecha + "</td>");
        myBuilder.Append("</tr>");

        myBuilder.Append("<tr><td colspan='2'>Si tienes dudas o preguntas, puedes responder este correo. Nosotros te ayudaremos siempre :)</td></tr>");
        myBuilder.Append("<tr><td colspan='2'>-------------</td></tr>");
        myBuilder.Append("<tr><td colspan='2'>El equipo de FacilitonOnline</td></tr>");

        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");

        // Obtenemos el string para el return
        myHtmlFile = myBuilder.ToString();

        return myHtmlFile;
    }

    private void EnviarCorreo (string correo,string fecha,string usuario){ 
    
        string datos = ConvertToHtmlFile(correo,fecha,usuario);

        string msg1="ssss";
        try
        {
            Correos Cr = new Correos();
            //Inicializar mensaje de correo
            MailMessage MM = new MailMessage();
            //Establecemso el asunto
            MM.Subject = "Confirmacion de cuenta FacilOnline";
            //Correo de destimo
            string email = correo;
            MM.To.Add(new MailAddress(email));
            //Aki correo d origen
            MM.From = new MailAddress("web0cool@hotmail.com", "Administrador");

            //Ajuntar algun archivo
            //string ruta = HttpContext.Current.Request.MapPath("~/imagen/rrohan.jpg");
            //MM.Attachments.Add(new Attachment(ruta));
            //el contenido del mensaje
            MM.Body = datos;
            MM.IsBodyHtml = true;
            // Enviar
            Cr.MandarCorreo(MM);
            //Enviado = true;

            //Mostrar mensaje
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

        
        
    
    }

}