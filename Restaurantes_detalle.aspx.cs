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
using System.Drawing;

public partial class Restaurantes_detalle : System.Web.UI.Page
{
    Comentario c = new Comentario();
    SubComentario sc = new SubComentario();
    string razonSocial;
    
    protected void Page_Load(object sender, EventArgs e)
    {
        Cliente c = new Cliente();
        
        razonSocial = Request.QueryString.Get("m");

        GridView1.DataSource = c.buscarClientePorRazonSocial(razonSocial);
        GridView1.DataBind();
        
        DataTable direccionCompleta = c.obtenerDireccionCliente(razonSocial);

        lblCalle.Value = direccionCompleta.Rows[0][0].ToString().Trim();
        lblMunicipio.Value = direccionCompleta.Rows[0][1].ToString().Trim();
        lblEstado.Value = direccionCompleta.Rows[0][2].ToString().Trim();
        lblPais.Value = direccionCompleta.Rows[0][3].ToString().Trim();

        // Ejempo: Esta direccion si existe
        // string script = "initialize('Paul Linder - San borja','San borja','Lima','Peru');";
        // string script = "initialize('Calle los halcones 124 - SAN ISIDRO','SAN ISIDRO','Lima','Peru');";
        string script = "initialize('" + lblCalle.Value + "','" + lblMunicipio.Value + "','" + lblEstado.Value + "','" + lblPais.Value + "');";

        string src = "http://maps.googleapis.com/maps/api/js?sensor=false";

        this.ClientScript.RegisterClientScriptResource(this.GetType(), src);
        
        this.ClientScript.RegisterStartupScript(this.GetType(), "ini", script,true);


        comentarios(razonSocial);
        txtComentario.Attributes.Add("OnFocus", "LimpiarTexto(this);");
        //txtComentario.Attributes.Add("onkeydown", "if(event.which || event.keyCode){if ((event.which == 13) || (event.keyCode == 13)) {document.getElementById('" + btnComentar.UniqueID + "').click();return false;}} else {return true}; ");
    }

    private string GetConnectionString()
    {
        // To avoid storing the connection string in your code,
        // you can retrieve it from a configuration file.
        return "Server=XxkokoxX-VAIO\\SQLEXPRESS; Database=FACILITOONLINE; uid=i7exe; pwd=sql";
        /* return "Data Source=(local);Integrated Security=true;" +
        "Initial Catalog=AdventureWorks;"; */
    }

    public void comentarios(string razon)
    {
        lblCache.Text = "Cache Refresh: (Cada 3 minutos) " + DateTime.Now.ToLongTimeString();

        // Create a dependency connection to the database.
        SqlDependency.Start(GetConnectionString());

        using (SqlConnection connection = new SqlConnection(GetConnectionString()))
        {
            using (SqlCommand command = new SqlCommand(ObtenerComentarios(razon), connection))
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

                if (!Context.User.Identity.IsAuthenticated)
                {
                    imgComentario1.ImageUrl = string.Format("img/avatar/Ninguno.jpg");
                }
                else
                {
                    imgComentario1.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);
                }
            }
        }
    }
    private string ObtenerComentarios(string razon)
    {
        return "select * from tb_usuario u join tb_comentario c on u.email = c.usuario where c.cliente = '" + razon+"'";
    }
    protected void btnComentar_Click(object sender, EventArgs e)
    {
        if (!Context.User.Identity.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
        }
        else
        {
            imgComentario1.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);

            try
            {
                if (txtComentario.Text == string.Empty)
                {
                    lblMensaje.Text = "Escribe un comentario...";
                }
                else
                {
                    DataComentario dc = new DataComentario();

                    dc.Comentario = txtComentario.Text;
                    dc.Usuario = Context.User.Identity.Name;
                    dc.Cliente = razonSocial;

                    string msg = c.registrarComentario(dc);

                    lblMensaje.Text = msg;
                    string script = @"<script type='text/javascript'> alert('{0}'); </script>";
                    script = string.Format(script, msg);
                    ScriptManager.RegisterStartupScript(this, typeof(Page), "alerta", script, false);
                }
            }
            catch (Exception ex)
            {
                lblMensaje.Text = ex.Message;
            }
        }
    }

    protected void GridComentarios_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            //string idComentario = e.Row.Cells[0].Text; // Si fuese un BoundField
            string idComentario = (e.Row.Cells[0].FindControl("lblIdComentario") as Label).Text;
            GridView grilla = (GridView)e.Row.FindControl("GridSubComentario");

            lblCache.Text = "Cache Refresh: " + DateTime.Now.ToLongTimeString();

            SqlDependency.Start(GetConnectionString());

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand(ObtenerSubComentarios(idComentario), connection))
                {
                    SqlCacheDependency dependency = new SqlCacheDependency(command);

                    int numberOfMinutes = 3;
                    DateTime expires = DateTime.Now.AddMinutes(numberOfMinutes);

                    Response.Cache.SetExpires(expires);
                    Response.Cache.SetCacheability(HttpCacheability.Public);
                    Response.Cache.SetValidUntilExpires(true);

                    Response.AddCacheDependency(dependency);

                    connection.Open();

                    grilla.DataSource = command.ExecuteReader();
                    grilla.DataBind();

                    if (!Context.User.Identity.IsAuthenticated)
                    {
                        imgComentario1.ImageUrl = string.Format("img/avatar/Ninguno.jpg");
                    }
                    else
                    {
                        imgComentario1.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);
                    }
                }
            }
            
        }
    }
    private string ObtenerSubComentarios(string id)
    {
        //
        //return "select * from tb_post p join tb_comentario c on p.comentario = c.id where c.id = " + id;

        return "select p.id,p.usuario,u.nombres+ ' '+ u.apellidos as nombreCompleto, p.subComentario, "+
            "p.comentario from tb_post p join tb_comentario c on p.comentario = c.id  join tb_usuario u "+
            "on p.usuario = u.email where c.id =" + id;
    }
    protected void btnSubComentar_Click(object sender, EventArgs e)
    {
        
    }

    protected void btnReservar_Click(object sender, EventArgs e)
    {
        if (!Context.User.Identity.IsAuthenticated)
        {
            FormsAuthentication.RedirectToLoginPage();
            //Response.Redirect("Login_Usuario.aspx");
        }
        else
        {

            HttpCookie dato = new HttpCookie("dato");

            DataControlFieldCell f = (DataControlFieldCell)((Control)sender).Parent;
            string muni = (f.FindControl("lblMunicipio")as Label).Text;

            dato.Values["local"] = muni;
            dato.Values["ruc"] = Request.QueryString.Get("m");

            Response.Cookies.Add(dato);
            ClientScript.RegisterStartupScript(this.GetType(), "myScript", "<script>javascript:a();</script>");
        }
    }
    
    /*protected void GridView1_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (!Context.User.Identity.IsAuthenticated)
        {
            //FormsAuthentication.RedirectToLoginPage("Login_Usuario.aspx");
            Response.Redirect("Login_Usuario.aspx");
        }
        else
        {
            HttpCookie dato = new HttpCookie("dato");

            Label lblmuni = GridView1.SelectedRow.FindControl("lblMunicipio") as Label;


            dato.Values["local"] = lblmuni.Text;
            dato.Values["ruc"] = Request.QueryString.Get("m");

            Response.Cookies.Add(dato);
            ClientScript.RegisterStartupScript(this.GetType(), "myScript", "<script>javascript:a();</script>");
        }
    }*/

    // Grilla anidados
    protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        Cliente cli = new Cliente();

        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            //string codusuario = e.Row.Cells[1].Text;
            GridView grilla = (GridView)e.Row.FindControl("GridView2");
            string ciudad = (e.Row.FindControl("lblCiudad") as Label).Text;

            grilla.DataSource = cli.listarClienteSimilares(ciudad);
            grilla.DataBind();
        }
    }

}