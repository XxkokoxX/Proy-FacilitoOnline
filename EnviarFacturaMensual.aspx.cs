using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data;
using System.Text;
using System.Net.Mail;

public partial class EnviarVariosCorreos : System.Web.UI.Page
{
    CorreoAutomatico ca = new CorreoAutomatico();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            cboListaDeCorreos.DataSource = ca.listarCorreosDeSocios();
            cboListaDeCorreos.DataTextField = "emailContacto";
            cboListaDeCorreos.DataBind();

            lblFechaEnvio.Text = DateTime.Today.ToShortDateString();
        }
    }

    protected void btnEnviarATodos_Click(object sender, EventArgs e)
    {
        DataTable tb = ca.listarCorreosDeSocios();
        foreach(DataRow item in tb.Rows){
            enviarCorreo(item[0].ToString(), item[1].ToString());
        }
    }

    public void enviarCorreo(string clienteSocio,string emailSocio)
    {
        string datos = ConvertToHtmlFile();
        string msg = "";
        string script = "";
        try
        {
            Correos Cr = new Correos();
            System.Net.Mail.MailMessage mnsj = new MailMessage();
            mnsj.Subject = "Comprobante de Pago de Cuenta FacilitoOnline";
            string email = emailSocio;
            mnsj.To.Add(new MailAddress(email));
            mnsj.From = new MailAddress("web0cool@hotmail.com", "Administrador");
            string ruta = HttpContext.Current.Request.MapPath("~/img/iconos/gracias.gif");
            mnsj.Attachments.Add(new Attachment(ruta));
            mnsj.Body = "AVISO DE VENCIMIENTO - FACILITOONLINE \n\n\n" + "Estimado(a) Socio(a) :" + clienteSocio + "\n" + datos;
            mnsj.IsBodyHtml = true;
            Cr.MandarCorreo(mnsj);
            msg = "La Factura mensual ha sido enviada a los socios correctamente" + " Listo!!";
        }
        catch (Exception ex)
        {
            msg = ex.Message;

        }
        script = @"<script type='text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, msg);
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
        btnEnviarATodos.Enabled = false;
    }

    public string ConvertToHtmlFile()
    {
        string myHtmlFile = "";
      
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
        myBuilder.Append("<td>Código</td>");
        myBuilder.Append("<td>Fecha de Vencimiento</td>");
        myBuilder.Append("<td>Tipo de Documento</td>");
        myBuilder.Append("<td>Número de Documento</td>");
        myBuilder.Append("<td>Importe a Pagar</td>");
        myBuilder.Append("<tr>");

        myBuilder.Append("<tr>");
        myBuilder.Append("<td>I201010865</td>");
        myBuilder.Append("<td>04/12/2012</td>");
        myBuilder.Append("<td>BV</td>");
        myBuilder.Append("<td>100-0042346</td>");
        myBuilder.Append("<td>S/. 100.00</td>");
        myBuilder.Append("<tr>");

        myBuilder.Append("<tr><td colspan='5'>Si tienes dudas o preguntas, puedes responder este correo. Nosotros te ayudaremos siempre :)</td></tr>");
        myBuilder.Append("<tr><td colspan='5'>-------------</td></tr>");
        myBuilder.Append("<tr><td colspan='5'>El equipo de FacilitonOnline</td></tr>");
        myBuilder.Append("<tr><td colspan='5'>No olvide descargar el archivo Adjunto</td></tr>");

        myBuilder.Append("</table>");
        myBuilder.Append("</body>");
        myBuilder.Append("</html>");

        // Obtenemos el string para el return
        myHtmlFile = myBuilder.ToString();

        return myHtmlFile;
    }
}