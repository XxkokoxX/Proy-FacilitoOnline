using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class EnviarCotizacion : System.Web.UI.Page
{
    Cliente cliente = new Cliente();
    Cotizacion cot = new Cotizacion();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            cboCliente.DataSource = cot.listarCliente();
            cboCliente.DataTextField = "razonSocial";
            cboCliente.DataValueField = "membresia";
            cboCliente.DataBind();

            DataTable datosCliente = cliente.buscarCliente(cboCliente.SelectedValue);
            txtMail.Text = datosCliente.Rows[0]["emailContacto"].ToString();
            txtDireccion.Text = datosCliente.Rows[0]["calle"].ToString();
            txtWeb.Text = datosCliente.Rows[0]["sitioweb"].ToString();
        }
    }

    protected void cboCliente_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable datosCliente = cliente.buscarCliente(cboCliente.SelectedValue);
        txtMail.Text = datosCliente.Rows[0]["emailContacto"].ToString();
        txtDireccion.Text = datosCliente.Rows[0]["calle"].ToString();
        txtWeb.Text = datosCliente.Rows[0]["sitioweb"].ToString();
    }

    protected void btnRegistrar_Click(object sender, EventArgs e)
    {


        if (txtFecha.Text.Trim().Equals("") || txtNroPersonas.Text.Trim().Equals("") ||
            txtMotivo.Text.Trim().Equals(""))
        {
            lblMensaje.Text = "Por favor completar todos los campos";
            return;
        }

        try
        {
            int cantidad;
            cantidad = Int32.Parse(txtNroPersonas.Text);
        }
        catch (Exception ex) {
            lblMensaje.Text = "Por favor ingrese una cantidad numerica";
            return;
        }

        try
        {
            DateTime fecha;
            fecha = DateTime.Parse(txtFecha.Text);
        }
        catch (Exception ex) {
            lblMensaje.Text = "Por favor ingrese una fecha valida";
            return;
        }

        if (DateTime.Parse(txtFecha.Text) < DateTime.Today) {
            lblMensaje.Text = "La fecha de solicitud debe ser mayor a la fecha actual";
            return;
        }


        cot.registrarCotizacion(Context.User.Identity.Name, cboCliente.SelectedValue, int.Parse(txtNroPersonas.Text), txtMotivo.Text, DateTime.Parse(txtFecha.Text));
        lblMensaje.Text = "Solicitud de cotizacion enviada";

        cboCliente.Enabled = false;
        txtFecha.Enabled = false;
        txtNroPersonas.Enabled = false;
        txtMotivo.Enabled = false;

    }
}