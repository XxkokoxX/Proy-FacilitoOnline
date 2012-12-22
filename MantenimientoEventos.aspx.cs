using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoUsuario : System.Web.UI.Page
{
    Eventos ce = new Eventos();

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
                    GridView1.DataSource = ce.listarEventos() ;
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
        GridView1.DataSource = ce.listarEventos();
        GridView1.DataBind();
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            activarCampos();

            hdfCodigoAlerta.Value = GridView1.SelectedRow.Cells[1].Text;
            txtEvento.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[2].Text);

            DateTime f1 = DateTime.Parse(GridView1.SelectedRow.Cells[4].Text);
            DateTime f2 = DateTime.Parse(GridView1.SelectedRow.Cells[5].Text);

            txtDescripcion.Text = Server.HtmlDecode(GridView1.SelectedRow.Cells[3].Text);
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
                DataEventos de = new DataEventos();

                de.Evento = txtEvento.Text;
                de.Descripcion = txtDescripcion.Text;
                de.Fecha_inicio= DateTime.Parse(txtFechaInicio.Text);
                de.Fecha_fin = DateTime.Parse(txtFechaFin.Text);
                de.Cliente = txtCliente.Text;

                string msg = ce.registrEventos(de);
                lblMensaje.Text = msg;

                GridView1.DataSource = ce.listarEventos();
                GridView1.DataBind();

                desactivarCampos();
            }
            else
            {
                DataEventos de = new DataEventos();

                de.Id = int.Parse( hdfCodigoAlerta.Value);
                de.Evento = txtEvento.Text;
                de.Descripcion = txtDescripcion.Text;
                de.Fecha_inicio = DateTime.Parse(txtFechaInicio.Text);
                de.Fecha_fin = DateTime.Parse(txtFechaFin.Text);

                string msg = ce.modificarEventos(de);
                lblMensaje.Text = msg;

                GridView1.DataSource = ce.listarEventos();
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
            DataEventos de = new DataEventos();

            de.Id = int.Parse(hdfCodigoAlerta.Value);

            string msg = ce.eliminaEventos(de);
            lblMensaje.Text = msg;

            GridView1.DataSource = ce.listarEventos();
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
        txtEvento.Text = "";
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

        txtEvento.Enabled = true;
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
        txtEvento.Enabled = false;
        txtDescripcion.Enabled = false;
        txtFechaInicio.Enabled = false;
        txtFechaFin.Enabled = false;
        FileUpload1.Enabled = false;
    }

}