using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;


using System.Web.UI.WebControls;
using System.Data;

public partial class ActualizarDatosEmpresa : System.Web.UI.Page
{
    Pais p = new Pais();
    Cliente cli = new Cliente();
    DataCliente objCli = new DataCliente();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            cboCargo.DataSource = cli.listarCargos();
            cboCargo.DataTextField = "cargo";
            cboCargo.DataValueField = "id";
            cboCargo.DataBind();

            cboPais.DataSource = p.listarPaises();
            cboPais.DataTextField = "pais";
            cboPais.DataValueField = "id";
            cboPais.DataBind();

            cboEstado.DataSource = p.listarEstados();
            cboEstado.DataTextField = "estado";
            cboEstado.DataValueField = "id";
            cboEstado.DataBind();

            cboTipoCliente.DataSource = cli.listarTipoCliente();
            cboTipoCliente.DataTextField = "descripcion";
            cboTipoCliente.DataValueField = "id_tipo_cliente";
            cboTipoCliente.DataBind();

            DataTable datosCliente = cli.buscarCliente(Context.User.Identity.Name);
            txtContacto.Text = datosCliente.Rows[0]["nombreContacto"].ToString();
            txtEmail.Text = datosCliente.Rows[0]["emailContacto"].ToString();
            txtContacto.Text = datosCliente.Rows[0]["NombreContacto"].ToString();
            cboCargo.SelectedValue = datosCliente.Rows[0]["cargoContacto"].ToString();
            txtRazonSocial.Text = datosCliente.Rows[0]["razonSocial"].ToString();
            txtCalle.Text = datosCliente.Rows[0]["calle"].ToString();
            txtNumeroExterior.Text = datosCliente.Rows[0]["numeroExterior"].ToString();
            txtNumeroInterior .Text = datosCliente.Rows[0]["numeroInterior"].ToString();
            txtMunicipio.Text = datosCliente.Rows[0]["municipio"].ToString();
            txtCodigoPostal.Text = datosCliente.Rows[0]["codigoPostal"].ToString();
            txtCiudad.Text = datosCliente.Rows[0]["ciudad"].ToString();
            cboPais.SelectedValue = datosCliente.Rows[0]["pais"].ToString();
            cboEstado.SelectedValue = datosCliente.Rows[0]["estado"].ToString();
            cboTipoCliente.SelectedValue = datosCliente.Rows[0]["tipoCliente"].ToString();
            txtSitioWeb.Text = datosCliente.Rows[0]["sitioweb"].ToString();
            txtActividadPreponderante.Text = datosCliente.Rows[0]["actividadPreponderante"].ToString();
            txtListarProductos.Text = datosCliente.Rows[0]["listadoDeProductos"].ToString();
        }
    }

    protected void cboPais_SelectedIndexChanged(object sender, EventArgs e)
    {
        cboEstado.DataSource = p.listarEstadoxPais(cboPais.SelectedValue.ToString());
        cboEstado.DataTextField = "estado";
        cboEstado.DataValueField = "id";
        cboEstado.DataBind();
    }

    protected void btnRegistrar_Click(object sender, EventArgs e)
    {
        DataCliente c = new DataCliente();
        
        c.Membresia =  Context .User.Identity.Name;
        c.Clave =  Context .User.Identity.Name;
        c.Contacto = txtContacto.Text;
        c.Email = txtEmail.Text;
        c.Cargo = int.Parse(cboCargo.SelectedValue);
        c.RazonSocial = txtRazonSocial.Text;
        c.Calle = txtCalle.Text;
        c.NumeroExterior = txtNumeroExterior.Text;
        c.NumeroInterior = txtNumeroInterior.Text;
        c.Municipio = txtMunicipio.Text;
        c.CodigoPostal = txtCodigoPostal.Text;
        c.Ciudad = txtCiudad.Text;
        c.Pais = cboPais.SelectedValue;
        c.Estado = int.Parse(cboEstado.SelectedValue);
        c.SitioWeb = txtSitioWeb.Text;
        c.ActividadPreponderante = txtActividadPreponderante.Text;
        c.ListadoProductos = txtListarProductos.Text;
        c.TipoCliente = int.Parse(cboTipoCliente.SelectedValue);

        cli.registraYmodificaCliente(c);

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "Se han modificado los datos correctamente");
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
    }
}