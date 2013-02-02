using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class VerCotizacionesCliente : System.Web.UI.Page
{
    Cotizacion cotiz = new Cotizacion();

    protected void Page_Load(object sender, EventArgs e)
    {
        gridDetalleCotizacion.DataSource = cotiz.listarCotizacionesCliente(Context.User.Identity.Name);
        gridDetalleCotizacion.DataBind();
        validarGrilla();
    }

    protected void gridDetalleCotizacion_SelectedIndexChanged(object sender, EventArgs e)
    {
        try
        {
            txtRespuesta.Text = "";
            hdfId.Value = gridDetalleCotizacion.SelectedRow.Cells[1].Text;
        }
        catch (Exception ex)
        {
        }
    }

    protected void btnAceptar_Click(object sender, EventArgs e)
    {
        cotiz.responderCotizacion(Convert.ToInt32(hdfId.Value), txtRespuesta.Text);
        gridDetalleCotizacion.DataSource = cotiz.listarCotizacionesCliente(Context.User.Identity.Name);
        gridDetalleCotizacion.DataBind();
        validarGrilla();
        txtRespuesta.Text = "";

        string script = @"<script type = 'text/javascript'> alert('{0}'); </script>";
        script = string.Format(script, "La cotización fue respondida");
        ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
    }

    public void validarGrilla()
    {
        if (gridDetalleCotizacion.Rows.Count == 0)
        {
            txtRespuesta.Visible = false;
            btnAceptar.Visible = false;
        }
        else
        {
            txtRespuesta.Visible = true;
            btnAceptar.Visible = true;
        }
    }
}