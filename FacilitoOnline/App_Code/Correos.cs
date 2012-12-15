using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

// Agregamos un nuevo Using a la clase.
using System.Net.Mail;

/*
  Esta esla Clase encargada de enviar los correos, ahora podemos llamarla desde cualquier punto de nuestra aplicación.
  Sin olvidar agregar el Using Correspondiente: using System.Net.Mail;
 */

public class Correos
{
    /* Para el caso de que no contemos con un servidor de correo podemos usar los que ya conocemos */
    /*
         * Cliente SMTP
         * Gmail:  smtp.gmail.com  puerto:587
         * Hotmail: smtp.liva.com  puerto:25
    */

    SmtpClient server = new SmtpClient("smtp.live.com", 25);

    public Correos()
    {
        //
        // TODO: Agregar aquí la lógica del constructor
        //

        /*
             * Autenticacion en el Servidor
             * Utilizaremos nuestra cuenta de correo
             *
             * Direccion de Correo (Gmail o Hotmail)
             * y Contrasena correspondiente
         */
        server.Credentials = new System.Net.NetworkCredential("web0cool@hotmail.com", "1234567897a");
        server.EnableSsl = true;
    }

    public void MandarCorreo(MailMessage mensaje)
    {
        server.Send(mensaje);
    }
}


