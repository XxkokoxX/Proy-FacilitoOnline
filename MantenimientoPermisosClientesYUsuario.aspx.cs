using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


using System.Web.Security;

public partial class MantenimientoPermisosClientesYUsuario : System.Web.UI.Page
{
    Permisos p = new Permisos();

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (!Page.IsPostBack)
            {
                if (!Context.User.Identity.IsAuthenticated)
                {
                    FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
                }
                else
                {
                    GridView2.DataSource = p.listarsUsuariosYClientesSinPermiso();
                    GridView2.DataBind();

                    GridView1.DataSource = p.listarPermisosUsuariosYClientes();
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
        GridView1.DataSource = p.listarPermisosUsuariosYClientes();
        GridView1.DataBind();
    }

    protected void GridView2_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView2.PageIndex = e.NewPageIndex;
        GridView2.DataSource = p.listarsUsuariosYClientesSinPermiso();
        GridView2.DataBind();
    }

    protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {

            string KeyID1 = GridView1.DataKeys[e.Row.RowIndex].Values[0].ToString();
            string KeyID2 = GridView1.DataKeys[e.Row.RowIndex].Values[1].ToString();
            string KeyID3 = GridView1.DataKeys[e.Row.RowIndex].Values[2].ToString();
            string KeyID4 = GridView1.DataKeys[e.Row.RowIndex].Values[3].ToString();
            string KeyID5 = GridView1.DataKeys[e.Row.RowIndex].Values[4].ToString();

            System.Web.UI.WebControls.Image imagen1 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image2");
            System.Web.UI.WebControls.Image imagen2 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image3");
            System.Web.UI.WebControls.Image imagen3 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image4");
            System.Web.UI.WebControls.Image imagen4 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image5");
            System.Web.UI.WebControls.Image imagen5 = (System.Web.UI.WebControls.Image)e.Row.FindControl("Image6");

            if (KeyID1 == "True")
            {
                imagen1.ImageUrl = "img/iconos/true.png";
            }
            else
            {
                imagen1.ImageUrl = "img/iconos/false.png";
            }

            if (KeyID2 == "True")
            {
                imagen2.ImageUrl = "img/iconos/true.png";
            }
            else
            {
                imagen2.ImageUrl = "img/iconos/false.png";
            }

            if (KeyID3 == "True")
            {
                imagen3.ImageUrl = "img/iconos/true.png";
            }
            else
            {
                imagen3.ImageUrl = "img/iconos/false.png";
            }

            if (KeyID4 == "True")
            {
                imagen4.ImageUrl = "img/iconos/true.png";
            }
            else
            {
                imagen4.ImageUrl = "img/iconos/false.png";
            }

            if (KeyID5 == "True")
            {
                imagen5.ImageUrl = "img/iconos/true.png";
            }
            else
            {
                imagen5.ImageUrl = "img/iconos/false.png";
            }
        }
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        int f = GridView1.SelectedIndex;

        string activo = (GridView1.Rows[f].Cells[2].FindControl("lblActivo") as Label).Text;
        string administrador = (GridView1.Rows[f].Cells[3].FindControl("lblAdministrador") as Label).Text;
        string visitante = (GridView1.Rows[f].Cells[4].FindControl("lblVisitante") as Label).Text;
        string socio = (GridView1.Rows[f].Cells[5].FindControl("lblSocio") as Label).Text;
        string invitado = (GridView1.Rows[f].Cells[6].FindControl("lblInvitado") as Label).Text;

        txtUsuarioCliente.Text = GridView1.SelectedRow.Cells[1].Text;
        chkActivo.Checked = bool.Parse(activo);
        chkAdministrador.Checked = bool.Parse(administrador);
        chkVisitante.Checked = bool.Parse(visitante);
        chkSocio.Checked = bool.Parse(socio);
        chkInvitado.Checked = bool.Parse(invitado);

        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        btnGrabar.Enabled = true;
        
        chkActivo.Enabled = true;
        chkAdministrador.Enabled = true;
        chkVisitante.Enabled = true;
        chkSocio.Enabled = true;
        chkInvitado.Enabled = true;
    }

    protected void GridView2_SelectedIndexChanged(object sender, EventArgs e)
    {
        txtUsuarioCliente.Text = GridView2.SelectedRow.Cells[1].Text;

        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        btnGrabar.Enabled = true;

        chkActivo.Enabled = true;
        chkAdministrador.Enabled = true;
        chkVisitante.Enabled = true;
        chkSocio.Enabled = true;
        chkInvitado.Enabled = true;
    }

    protected void btnNuevo_Click(object sender, EventArgs e)
    {
        btnNuevo.Enabled = false;
        btnGrabar.Text = "Grabar";
        lblMensaje.Text = "";
        txtUsuarioCliente.Text = "";

        lblFechaRegistro.Text = DateTime.Now.ToString();

        btnGrabar.Enabled = true;
        txtUsuarioCliente.Enabled = true;
        chkActivo.Enabled = false;
        chkAdministrador.Enabled = false;
        chkVisitante.Enabled = false;
        chkSocio.Enabled = false;
        chkInvitado.Enabled = false;
    }

    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        try
        {
            DataPermiso dp = new DataPermiso();

            dp.Cliente_O_Usuario = txtUsuarioCliente.Text;
            dp.Activo = chkActivo.Checked;
            dp.Administrador = chkAdministrador.Checked;
            dp.Visitante = chkVisitante.Checked;
            dp.ClienteSocio = chkSocio.Checked;
            dp.ClienteInvitado = chkInvitado.Checked;

            string msg = p.registrarYmodificarPermisoClienteYUsuarios(dp);
            lblMensaje.Text = msg;

            GridView1.DataSource = p.listarPermisosUsuariosYClientes();
            GridView1.DataBind();

            btnGrabar.Text = "Hecho.";

            btnNuevo.Enabled = true;
            btnGrabar.Enabled = false;
            txtUsuarioCliente.Enabled = false;
            chkActivo.Enabled = false;
            chkAdministrador.Enabled = false;
            chkVisitante.Enabled = false;
            chkSocio.Enabled = false;
            chkInvitado.Enabled = false;

            GridView2.DataSource = p.listarsUsuariosYClientesSinPermiso();
            GridView2.DataBind();
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

}