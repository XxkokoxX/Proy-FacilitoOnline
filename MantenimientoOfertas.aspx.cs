using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Ofertas o = new Ofertas();

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
                    GridView1.DataSource = o.listarOfertas();
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
        GridView1.DataSource = o.listarOfertas();
        GridView1.DataBind();
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            activarCampos();

            hdfCodigoAlerta.Value = GridView1.SelectedRow.Cells[1].Text;
            txtOferta.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[2].Text);
            txtDescripcion.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[3].Text);
            DateTime f1 = DateTime.Parse(GridView1.SelectedRow.Cells[4].Text);
            DateTime f2 = DateTime.Parse(GridView1.SelectedRow.Cells[5].Text);
            txtFechaInicio.Text = f1.ToShortDateString();
            txtFechaFin.Text = f2.ToShortDateString();
            lblFechaRegistro.Text = GridView1.SelectedRow.Cells[7].Text;
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
            lblFechaRegistro.Text = DateTime.Now.ToString();

            limpiarCampos();
            activarCampos();
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
      try
        {
            if (hdfCodigoAlerta.Value == null || hdfCodigoAlerta.Value.ToString().Equals(string.Empty))
            {
                DataOfertas doo = new DataOfertas();

                doo.Oferta = txtOferta.Text;
                doo.Descripcion = txtDescripcion.Text;
                doo.Fecha_inicio = DateTime.Parse(txtFechaInicio.Text);
                doo.Fecha_fin = DateTime.Parse(txtFechaFin.Text);
                doo.Cliente = txtCliente.Text;

                string msg = o.registraOfertas(doo);
                lblMensaje.Text = msg;

                GridView1.DataSource = o.listarOfertas();
                GridView1.DataBind();

                desactivarCampos();
            }
            else
            {
                DataOfertas doo = new DataOfertas();

                doo.Id = int.Parse(hdfCodigoAlerta.Value);
                doo.Oferta = txtOferta.Text;
                doo.Descripcion = txtDescripcion.Text;
                doo.Fecha_inicio = DateTime.Parse(txtFechaInicio.Text);
                doo.Fecha_fin = DateTime.Parse(txtFechaFin.Text);

                string msg = o.modificarOfertas(doo); ;
                lblMensaje.Text = msg;

                GridView1.DataSource = o.listarOfertas();
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
            DataOfertas doo = new DataOfertas();

            doo.Id = int.Parse(hdfCodigoAlerta.Value);

            string msg = o.eliminaOferta(doo);
            lblMensaje.Text = msg;

            GridView1.DataSource = o.listarOfertas(); ;
            GridView1.DataBind();

            limpiarCampos();
            desactivarCampos();
        }
        catch (Exception)
        {
            lblMensaje.Text = "Porfavor seleccione un registro de la tabla.";
        }
    }


    public void limpiarCampos()
    {
        txtOferta.Text = "";
        txtDescripcion.Text = "";
        txtFechaInicio.Text = "";
        txtFechaFin.Text = "";
    }
    public void activarCampos()
    {
        btnGrabar.Enabled = true;
        btnGrabar.Text = "Grabar";
        lblMensaje.Text = "";

        btnNuevo.Enabled = false;

        txtOferta.Enabled = true;
        txtDescripcion.Enabled = true;
        txtFechaInicio.Enabled = true;
        txtFechaFin.Enabled = true;
        FileUpload1.Enabled = true;
    }
    public void desactivarCampos()
    {
        btnGrabar.Text = "Hecho.";

        btnNuevo.Enabled = true;
        btnGrabar.Enabled = false;
        txtOferta.Enabled = false;
        txtDescripcion.Enabled = false;
        txtFechaInicio.Enabled = false;
        txtFechaFin.Enabled = false;
        FileUpload1.Enabled = false;
    }

}