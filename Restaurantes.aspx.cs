using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Restaurantes : System.Web.UI.Page
{
    Cliente c = new Cliente();
    Pais p = new Pais();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            GridView1.DataSource = c.listarCliente();
            GridView1.DataBind();

            cboDepartamento.DataSource = p.listarEstados();
            cboDepartamento.DataTextField = "estado";
            cboDepartamento.DataValueField = "id";
            cboDepartamento.DataBind();

            cboProvincia.DataSource = p.listarProvincias();
            cboProvincia.DataTextField = "nomprovincia";
            cboProvincia.DataValueField = "idprovincia";
            cboProvincia.DataBind();
        }
    }

    protected void btnBuscar_Click(object sender, EventArgs e)
    {
        GridView1.DataSource = c.filtro1(txtRestaurante.Text,int.Parse(cboDepartamento.SelectedValue.ToString()));
        GridView1.DataBind();
    }

    protected void cboDepartamento_SelectedIndexChanged(object sender, EventArgs e)
    {
        cboProvincia.DataSource = p.listarProvinciasxDistritos(cboDepartamento.SelectedValue.ToString());
        cboProvincia.DataTextField = "nomprovincia";
        cboProvincia.DataValueField = "idprovincia";
        cboProvincia.DataBind();
    }

    protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        GridView1.PageIndex = e.NewPageIndex;
        GridView1.DataSource = c.listarCliente();
        GridView1.DataBind();
    }
}