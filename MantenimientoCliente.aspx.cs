using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Cliente c = new Cliente();
    Pais p = new Pais();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                }
                else
                {
                    cboCargo.DataSource = c.listarCargos();
                    cboCargo.DataTextField = "cargo";
                    cboCargo.DataValueField = "id";
                    cboCargo.DataBind();

                    cboTipoCliente.DataSource = c.listarTipoCliente();
                    cboTipoCliente.DataTextField = "descripcion";
                    cboTipoCliente.DataValueField = "id_tipo_cliente";
                    cboTipoCliente.DataBind();

                    cboPais.DataSource = p.listarPaises();
                    cboPais.DataTextField = "pais";
                    cboPais.DataValueField = "id";
                    cboPais.DataBind();

                    cboEstado.DataSource = p.listarEstados();
                    cboEstado.DataTextField = "estado";
                    cboEstado.DataValueField = "id";
                    cboEstado.DataBind();

                    GridView1.DataSource = c.listarCliente();
                    GridView1.DataBind();
                }
            }
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView1.PageIndex = e.NewPageIndex;
        GridView1.DataSource = c.listarCliente();
        GridView1.DataBind();
    }

    protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {

            string KeyID1 = GridView1.DataKeys[e.Row.RowIndex].Values[0].ToString();
            System.Web.UI.WebControls.Image imagen1 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image2");

            if (int.Parse(KeyID1) == 1)
            {
                imagen1.ImageUrl = "img/usuarios/invitado.png";
            }
            else
            {
                imagen1.ImageUrl = "img/usuarios/socio.png";
            }
        }
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            int f = GridView1.SelectedIndex;

            string tipoCliente = (GridView1.Rows[f].Cells[18].FindControl("lblTipoCliente") as Label).Text;

            txtMembresia.Text =  Server.HtmlDecode( GridView1.SelectedRow.Cells[1].Text);
            txtClave.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[2].Text);
            txtContacto.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[3].Text);
            txtEmail.Text = GridView1.SelectedRow.Cells[4].Text;
            cboCargo.Text = GridView1.SelectedRow.Cells[5].Text;
            txtRazonSocial.Text = Server.HtmlDecode( GridView1.SelectedRow.Cells[6].Text);
            txtCalle.Text = Server.HtmlDecode( GridView1.SelectedRow.Cells[7].Text);
            txtNumeroExterior.Text = GridView1.SelectedRow.Cells[8].Text;
            txtNumeroInterior.Text = GridView1.SelectedRow.Cells[9].Text;
            txtMunicipio.Text = GridView1.SelectedRow.Cells[10].Text;
            txtCP.Text = GridView1.SelectedRow.Cells[11].Text;
            txtCiudad.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[12].Text);
            cboPais.Text = GridView1.SelectedRow.Cells[13].Text;
            cboEstado.Text = GridView1.SelectedRow.Cells[14].Text;
            txtSitioWeb.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[15].Text);
            txtActividadPreponderante.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[16].Text);
            txtListarProductos.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[17].Text);
            cboTipoCliente.Text = tipoCliente;

            gridDetalleCliente.DataSource = c.buscarCliente(Server.HtmlDecode(GridView1.SelectedRow.Cells[1].Text));
            gridDetalleCliente.DataBind();

            btnGrabar.Text = "Grabar";
            lblMensaje.Text = "";

            btnGrabar.Enabled = true;
            btnNuevo.Enabled = false;

            txtMembresia.Enabled = false;
            txtClave.Enabled = false;

            txtContacto.Enabled = true;
            txtEmail.Enabled = true;
            cboCargo.Enabled = true;
            txtRazonSocial.Enabled = true;
            txtCalle.Enabled = true;
            txtNumeroExterior.Enabled = true;
            txtNumeroInterior.Enabled = true;
            txtMunicipio.Enabled = true;
            txtCP.Enabled = true;
            txtCiudad.Enabled = true;
            cboPais.Enabled = true;
            cboEstado.Enabled = true;
            txtSitioWeb.Enabled = true;
            txtActividadPreponderante.Enabled = true;
            txtListarProductos.Enabled = true;
            cboTipoCliente.Enabled = true;
            FileUpload1.Enabled = true;

        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void gridDetalleCliente_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtEmail.Text = gridDetalleCliente.SelectedRow.Cells[1].Text;
        txtNumeroExterior.Text = gridDetalleCliente.SelectedRow.Cells[2].Text;
        txtNumeroInterior.Text = gridDetalleCliente.SelectedRow.Cells[3].Text;
        txtMunicipio.Text = gridDetalleCliente.SelectedRow.Cells[4].Text;
        txtCP.Text = gridDetalleCliente.SelectedRow.Cells[5].Text;
        txtSitioWeb.Text = Server.HtmlDecode(gridDetalleCliente.SelectedRow.Cells[6].Text);
        txtActividadPreponderante.Text = Server.HtmlDecode(gridDetalleCliente.SelectedRow.Cells[7].Text);
        txtListarProductos.Text = Server.HtmlDecode(gridDetalleCliente.SelectedRow.Cells[8].Text);
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        btnGrabar.Text = "Grabar";
        
        lblMensaje.Text = "";

        txtMembresia.Text = "";
        txtClave.Text = "";
        txtContacto.Text = "";
        txtEmail.Text = "";
        //cboCargo.Text = "";
        txtRazonSocial.Text = "";
        txtCalle.Text = "";
        txtNumeroExterior.Text = "";
        txtNumeroInterior.Text = "";
        txtMunicipio.Text = "";
        txtCP.Text = "";
        txtCiudad.Text = "";
        //cboPais.Text = "";
        //cboEstado.Text = "";
        txtSitioWeb.Text = "";
        txtActividadPreponderante.Text = "";
        txtListarProductos.Text = "";
        //cboTipoCliente.Text = "";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnNuevo.Enabled = false;
        btnGrabar.Enabled = true;
        
        txtMembresia.Enabled = true;
        txtClave.Enabled = true;
        txtContacto.Enabled = true;
        txtEmail.Enabled = true;
        cboCargo.Enabled = true;
        txtRazonSocial.Enabled = true;
        txtCalle.Enabled = true;
        txtNumeroExterior.Enabled = true;
        txtNumeroInterior.Enabled = true;
        txtMunicipio.Enabled = true;
        txtCP.Enabled = true;
        txtCiudad.Enabled = true;
        cboPais.Enabled = true;
        cboEstado.Enabled = true;
        txtSitioWeb.Enabled = true;
        txtActividadPreponderante.Enabled = true;
        txtListarProductos.Enabled = true;
        cboTipoCliente.Enabled = true;
        FileUpload1.Enabled = true;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            DataCliente dc = new DataCliente();

            dc.Membresia = txtMembresia.Text;
            dc.Clave = txtClave.Text;

            dc.Contacto = txtContacto.Text;
            dc.Email = txtEmail.Text;
            dc.Cargo = int.Parse(cboCargo.SelectedValue);
            dc.RazonSocial = txtRazonSocial.Text;
            dc.Calle = txtCalle.Text;
            dc.NumeroExterior = txtNumeroExterior.Text;
            dc.NumeroInterior = txtNumeroInterior.Text;
            dc.Municipio = txtMunicipio.Text;
            dc.CodigoPostal = txtCP.Text;
            dc.Ciudad = txtCiudad.Text;
            dc.Pais = cboPais.SelectedValue;
            dc.Estado = int.Parse(cboEstado.SelectedValue);
            dc.SitioWeb = txtSitioWeb.Text;
            dc.ActividadPreponderante = txtActividadPreponderante.Text;
            dc.ListadoProductos = txtListarProductos.Text;
            dc.TipoCliente = int.Parse(cboTipoCliente.SelectedValue);

            string msg = c.registraYmodificaCliente(dc);
            lblMensaje.Text = msg;

            GridView1.DataSource = c.listarCliente();
            GridView1.DataBind();

            btnGrabar.Text = "Hecho.";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;

            txtMembresia.Enabled = false;
            txtClave.Enabled = false;
            txtContacto.Enabled = false;
            txtEmail.Enabled = false;
            cboCargo.Enabled = false;
            txtRazonSocial.Enabled = false;
            txtCalle.Enabled = true;
            txtNumeroExterior.Enabled = false;
            txtNumeroInterior.Enabled = false;
            txtCalle.Enabled = false;
            txtMunicipio.Enabled = false;
            txtCP.Enabled = false;
            txtCiudad.Enabled = false;
            cboPais.Enabled = false;
            cboEstado.Enabled = false;
            txtSitioWeb.Enabled = false;
            txtActividadPreponderante.Enabled = false;
            txtListarProductos.Enabled = false;
            cboTipoCliente.Enabled = false;
            FileUpload1.Enabled = false;
            
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            DataCliente dc = new DataCliente();

            dc.Membresia = txtMembresia.Text;

            string msg = c.eliminarCliente(dc);
            lblMensaje.Text = msg;

            GridView1.DataSource = c.listarCliente();
            GridView1.DataBind();

            txtEmail.Text = "";
            txtClave.Text = "";
            txtContacto.Text = "";
            txtEmail.Text = "";
            //cboCargo.Text = "";
            txtRazonSocial.Text = "";
            txtCalle.Text = "";
            txtNumeroExterior.Text = "";
            txtNumeroInterior.Text = "";
            txtMunicipio.Text = "";
            txtCP.Text = "";
            txtCiudad.Text = "";
            //cboPais.Text = "";
            //cboEstado.Text = "";
            txtSitioWeb.Text = "";
            txtActividadPreponderante.Text = "";
            txtListarProductos.Text = "";
            //cboTipoCliente.Text = "";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;

            txtMembresia.Enabled = false;
            txtClave.Enabled = false;
            txtContacto.Enabled = false;
            txtEmail.Enabled = false;
            cboCargo.Enabled = false;
            txtRazonSocial.Enabled = false;
            txtCalle.Enabled = false;
            txtNumeroExterior.Enabled = false;
            txtNumeroInterior.Enabled = false;
            txtMunicipio.Enabled = false;
            txtCP.Enabled = false;
            txtCiudad.Enabled = false;
            cboPais.Enabled = false;
            cboEstado.Enabled = false;
            txtSitioWeb.Enabled = false;
            txtActividadPreponderante.Enabled = false;
            txtListarProductos.Enabled = false;
            cboTipoCliente.Enabled = false;
            FileUpload1.Enabled = false;            
        }
        catch (Exception)
        {
            lblMensaje.Text = "Porfavor seleccione un registro de la tabla.";
        }
    }
}