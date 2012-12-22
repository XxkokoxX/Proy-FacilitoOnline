using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Sucursales s = new Sucursales();
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
                    txtCliente.Text = Context.User.Identity.Name;
                    GridView1.DataSource = s.listarSucursales();
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
        GridView1.DataSource = s.listarSucursales();
        GridView1.DataBind();
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            activarCampos();
            cargarCombo();

            hdfCodigoAlerta.Value = GridView1.SelectedRow.Cells[1].Text;
            txtSucursal.Text = GridView1.SelectedRow.Cells[2].Text;
            txtDescripcion.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[3].Text);
            txtTelefono.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[4].Text);
            cboDistrito.Text = GridView1.SelectedRow.Cells[5].Text;
            txtDireccion.Text = Server.HtmlDecode( GridView1.SelectedRow.Cells[6].Text);
            lblFechaRegistro.Text = GridView1.SelectedRow.Cells[8].Text;
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        try
        {
            cargarCombo();

            lblFechaRegistro.Text = DateTime.Now.ToString();

            limpiarCampos();
            activarCampos();
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void cboDepartamento_SelectedIndexChanged(object sender, EventArgs e)
    {
        cboDistrito.DataSource = p.listarDistritosxDepartamentos(cboDepartamento.SelectedValue.ToString());
        cboDistrito.DataTextField = "desc_dist";
        cboDistrito.DataValueField = "id_distrito";
        cboDistrito.DataBind();
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
      try
        {
            if (hdfCodigoAlerta.Value == null || hdfCodigoAlerta.Value.ToString().Equals(string.Empty))
            {
                DataSucursal ds = new DataSucursal();

                ds.Sucursal = txtSucursal.Text;
                ds.Descripcion = txtDescripcion.Text;
                ds.Telefono = txtTelefono.Text;
                ds.Distrito = cboDistrito.SelectedValue;
                ds.Direccion = txtDireccion.Text;
                ds.Cliente = txtCliente.Text;

                string msg = s.registraSucursales(ds);
                lblMensaje.Text = msg;

                GridView1.DataSource = s.listarSucursales();
                GridView1.DataBind();

                desactivarCampos();
            }
            else
            {
                DataSucursal ds = new DataSucursal();

                ds.Id = int.Parse(hdfCodigoAlerta.Value);
                ds.Sucursal = txtSucursal.Text;
                ds.Descripcion = txtDescripcion.Text;
                ds.Telefono = txtTelefono.Text;
                ds.Distrito = cboDistrito.SelectedValue;
                ds.Direccion = txtDireccion.Text;
                ds.Cliente = txtCliente.Text;

                string msg = s.modificarSucursales(ds);
                lblMensaje.Text = msg;

                GridView1.DataSource = s.listarSucursales();
                GridView1.DataBind();

                hdfCodigoAlerta.Value = null;

                desactivarCampos();
            }
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
            DataSucursal ds = new DataSucursal();

            ds.Id = int.Parse(hdfCodigoAlerta.Value);

            string msg = s.eliminaSucursales(ds);
            lblMensaje.Text = msg;

            GridView1.DataSource = s.listarSucursales();
            GridView1.DataBind();

            limpiarCampos();
            limpiarCombo();
            desactivarCampos();
        }
        catch (Exception)
        {
            lblMensaje.Text = "Porfavor seleccione un registro de la tabla.";
        }
    }


    public void limpiarCampos()
    {
        txtSucursal.Text = "";
        txtTelefono.Text = "";
        txtDireccion.Text = "";
        txtDescripcion.Text = "";
    }
    public void limpiarCombo()
    {
        //lblMensaje.Text = "";
        cboDepartamento.Items.Clear();
        cboDistrito.Items.Clear();
    }
    public void activarCampos()
    {
        btnGrabar.Enabled = true;
        btnGrabar.Text = "Grabar";
        lblMensaje.Text = "";

        btnNuevo.Enabled = false;

        txtSucursal.Enabled = true;
        txtDescripcion.Enabled = true;
        txtTelefono.Enabled = true;
        cboDepartamento.Enabled = true;
        cboDistrito.Enabled = true;
        txtDireccion.Enabled = true;
        FileUpload1.Enabled = true;
    }
    public void desactivarCampos()
    {
        btnGrabar.Text = "Hecho.";

        btnNuevo.Enabled = true;
        btnGrabar.Enabled = false;
        txtSucursal.Enabled = false;
        txtDescripcion.Enabled = false;
        txtTelefono.Enabled = false;
        cboDepartamento.Enabled = false;
        cboDistrito.Enabled = false;
        txtDireccion.Enabled = false;
        FileUpload1.Enabled = false;
    }
    public void cargarCombo()
    {
        cboDepartamento.DataSource = p.listarEstados();
        cboDepartamento.DataTextField = "estado";
        cboDepartamento.DataValueField = "id";
        cboDepartamento.DataBind();

        cboDistrito.DataSource = p.listarDistritos();
        cboDistrito.DataTextField = "desc_dist";
        cboDistrito.DataValueField = "id_distrito";
        cboDistrito.DataBind();
    }
}