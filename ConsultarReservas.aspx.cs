using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class ConsultarReservas : System.Web.UI.Page
{
    Reserva r = new Reserva();
    //Cliente cli = new Cliente();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            if (!Context.User.Identity.IsAuthenticated)
            {
                //FormsAuthentication.RedirectToLoginPage("Login_Cliente.aspx");
                Response.Redirect("Login_Usuario.aspx");
            }
            else
            {
                txtFechaInicio.Text = DateTime.Today.ToShortDateString();
                txtFechaFin.Text = DateTime.Today.ToShortDateString();

                cboCliente.DataSource = r.ListarReserva(Context.User.Identity.Name);
                cboCliente.DataTextField = "ruc";
                cboCliente.DataValueField = "membresia";
                cboCliente.DataBind();

                listar();
            }
            
        }
    }

    private void listar(){

        string usuario = Context.User.Identity.Name;
        GridView1.DataSource = r.ListarReserva(usuario) ;
        GridView1.DataBind();
    }

    protected void GridView1_RowCancelingEdit(object sender, GridViewCancelEditEventArgs e)
    {
        GridView1.EditIndex = -1;
        listar();
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            int id = int.Parse(GridView1.Rows[e.RowIndex].Cells[1].Text);
            lblMensaje.Text = r.eliminarReserva(id);
            listar();
        }
        catch (Exception ex)
        {
            lblMensaje.Text = ex.Message;
        }
    }

    protected void GridView1_RowEditing(object sender, GridViewEditEventArgs e)
    {
        GridView1.EditIndex = e.NewEditIndex;
        listar();
    }

    protected void GridView1_RowUpdating(object sender, GridViewUpdateEventArgs e)
    {
        string p = "-->";
        try {
        GridViewRow row = GridView1.Rows[e.RowIndex];
        TextBox cant = GridView1.Rows[e.RowIndex].Cells[6].Controls[0] as TextBox;
        TextBox hora = GridView1.Rows[e.RowIndex].Cells[5].Controls[0] as TextBox;
        string id = GridView1.Rows[e.RowIndex].Cells[1].Text;
        p = id;
        lblMensaje.Text = r.ModificarReserva(id, hora.Text,cant.Text);

        GridView1.EditIndex = -1;
        listar();
        
        }catch(Exception ex){
            lblMensaje.Text= "----Z"+ex.Message +p;
        }

    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {

        GridView1.DataSource = r.BuscarListarReserva(cboCliente.SelectedValue.ToString());
        GridView1.DataBind();;
    }

    protected void btnLimpiar_Click(object sender, EventArgs e)
    {
        txtFechaInicio.Text = string.Empty;
        txtFechaFin.Text = string.Empty;
    }
}