using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Web.Security;

public partial class Ofertas_Socio : System.Web.UI.Page
{
    Conexion cn = new Conexion();

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
                    gridAlertas.DataSource = listarOfertas();
                    gridAlertas.DataBind();

                }
            }
        }
         catch (Exception ex)
         {
             lblMensaje.Text = ex.Message;
         }
    }

    private DataTable listarOfertas()
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("USP_LISTAR_OFERTAS", cn.getCn);
        sda.SelectCommand.CommandType = CommandType.StoredProcedure;
        sda.Fill(dt);
        return dt;
    }
    protected void btnGrabar_Click(object sender, EventArgs e)
    {
        if (hdfCodigoAlerta.Value == null || hdfCodigoAlerta.Value.ToString().Equals(string.Empty))
        {
            SqlCommand sc = new SqlCommand("USP_REGISTRAR_OFERTA", cn.getCn);
            sc.CommandType = CommandType.StoredProcedure;
            sc.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = txtDescripcion.Text;
            sc.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = Convert.ToDateTime(txtFechaInicio.Text);
            sc.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = Convert.ToDateTime(txtFechaFin.Text);

            cn.getCn.Open();
            sc.ExecuteNonQuery();
            cn.getCn.Close();

            gridAlertas.DataSource = listarOfertas();
            gridAlertas.DataBind();

            txtDescripcion.Text = string.Empty;
            txtFechaInicio.Text = string.Empty;
            txtFechaFin.Text = string.Empty;

            limpiarCampos();
        }
        else
        {
            SqlCommand sc = new SqlCommand("USP_ACTUALIZAR_OFERTA", cn.getCn);
            sc.CommandType = CommandType.StoredProcedure;
            sc.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(hdfCodigoAlerta.Value);
            sc.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = txtDescripcion.Text;
            sc.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = Convert.ToDateTime(txtFechaInicio.Text);
            sc.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = Convert.ToDateTime(txtFechaFin.Text);

            cn.getCn.Open();
            sc.ExecuteNonQuery();
            cn.getCn.Close();

            gridAlertas.DataSource = listarOfertas();
            gridAlertas.DataBind();

            hdfCodigoAlerta.Value = null;

            limpiarCampos();
        }
    }

    public void limpiarCampos()
    {
        txtDescripcion.Text = string.Empty;
        txtFechaInicio.Text = string.Empty;
        txtFechaFin.Text = string.Empty;
    }

    protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        try
        {
            int codigo = Convert.ToInt32(e.Values["id"].ToString());
            SqlCommand sc = new SqlCommand("USP_ELIMINAR_SUCURSAL", cn.getCn);
            sc.CommandType = CommandType.StoredProcedure;
            sc.Parameters.Add("@id", SqlDbType.Int).Value = codigo;

            cn.getCn.Open();
            sc.ExecuteNonQuery();
            cn.getCn.Close();

            gridAlertas.DataSource = listarOfertas();
            gridAlertas.DataBind();
        }
        catch (Exception)
        {            
        }
    }

    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        hdfCodigoAlerta.Value = gridAlertas.SelectedRow.Cells[1].Text;   
        txtDescripcion.Text = gridAlertas.SelectedRow.Cells[2].Text;
        txtFechaInicio.Text = gridAlertas.SelectedRow.Cells[3].Text;
        txtFechaFin.Text = gridAlertas.SelectedRow.Cells[4].Text;        
    }
}