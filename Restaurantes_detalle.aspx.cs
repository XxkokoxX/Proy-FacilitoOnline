using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

using System.Web.Security;
using System.Data.SqlClient;
using System.Web.Caching;

public partial class Restaurantes_detalle : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Cliente c = new Cliente();
        
        string razonSocial = Request.QueryString.Get("m");

        GridView1.DataSource = c.buscarClientePorRazonSocial(razonSocial);
        GridView1.DataBind();
        
        DataTable direccionCompleta = c.obtenerDireccionCliente(razonSocial);

        lblCalle.Value = direccionCompleta.Rows[0][0].ToString().Trim();
        lblMunicipio.Value = direccionCompleta.Rows[0][1].ToString().Trim();
        lblEstado.Value = direccionCompleta.Rows[0][2].ToString().Trim();
        lblPais.Value = direccionCompleta.Rows[0][3].ToString().Trim();
        
        string script = "initialize('" + lblCalle.Value + "','" + lblMunicipio.Value + "','" + lblEstado.Value + "','" + lblPais.Value + "');";
        // Ejempo: Esta direccion si existe
        // string script = "initialize('Paul Linder - San borja','San borja','Lima','Peru');";
        // string script = "initialize('Calle los halcones 124 - SAN ISIDRO','SAN ISIDRO','Lima','Peru');";

        string src = "http://maps.googleapis.com/maps/api/js?sensor=false";

        this.ClientScript.RegisterClientScriptResource(this.GetType(), src);
        
        this.ClientScript.RegisterStartupScript(this.GetType(), "ini", script,true);


        comentarios();
    }

    public void comentarios()
    {
        lblCache.Text = "Cache Refresh: " + DateTime.Now.ToLongTimeString();

        // Create a dependency connection to the database.
        SqlDependency.Start(GetConnectionString());

        using (SqlConnection connection = new SqlConnection(GetConnectionString()))
        {
            using (SqlCommand command = new SqlCommand(GetSQL(), connection))
            {
                SqlCacheDependency dependency = new SqlCacheDependency(command);
                // Refresh the cache after the number of minutes
                // listed below if a change does not occur.
                // This value could be stored in a configuration file.
                int numberOfMinutes = 3;
                DateTime expires = DateTime.Now.AddMinutes(numberOfMinutes);

                Response.Cache.SetExpires(expires);
                Response.Cache.SetCacheability(HttpCacheability.Public);
                Response.Cache.SetValidUntilExpires(true);

                Response.AddCacheDependency(dependency);

                connection.Open();

                GridComentarios.DataSource = command.ExecuteReader();
                GridComentarios.DataBind();

                //imgComentario2.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);

                if (!Context.User.Identity.IsAuthenticated)
                {
                    imgComentario2.ImageUrl = string.Format("img/avatar/Ninguno.jpg");
                }
                else
                {
                    imgComentario2.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);
                }
            }
        }
    }
    private string GetConnectionString()
    {
        // To avoid storing the connection string in your code,
        // you can retrieve it from a configuration file.
        return "Server=XxkokoxX-VAIO\\SQLEXPRESS; Database=FACILITOONLINE; uid=i7exe; pwd=sql";
        /* return "Data Source=(local);Integrated Security=true;" +
        "Initial Catalog=AdventureWorks;"; */
    }
    private string GetSQL()
    {
        return "select * from tb_usuario u join tb_comentario c on u.email = c.usuario";
    }
    protected void btnComentar_Click(object sender, EventArgs e)
    {
        if (!Context.User.Identity.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
        }
        else
        {
            imgComentario2.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);
        }
    }

    protected void btnReservar_Click(object sender, EventArgs e)
    {

    }
    protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (!Context.User.Identity.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
        }
        else
        {
            HttpCookie dato = new HttpCookie("dato");

            Label lblmuni = GridView1.SelectedRow.FindControl("lblMunicipio") as Label;


            dato.Values["local"] = lblmuni.Text ;
            dato.Values["ruc"] = Request.QueryString.Get("m");

            Response.Cookies.Add(dato);
            ClientScript.RegisterStartupScript(this.GetType(), "myScript", "<script>javascript:a();</script>");
        }
    }

}