using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Data.SqlClient;
using System.Data;
using System.Web.Security;

public partial class Dashboard : System.Web.UI.MasterPage
{
    Conexion cn = new Conexion();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            try
            {
                if (Context.User.Identity.IsAuthenticated)
                {
                    Permisos(Context.User.Identity.Name);
                    Image1.ImageUrl = string.Format("img/avatar/{0}.jpg", Context.User.Identity.Name);
                }
            }
            catch (Exception ex)
            {
                lblOpciones.Text = ex.Message;
            }
        }
    }

    void Permisos(string prmUserLogin)
    {
        try
        {
            cn.getCn.Open();
            SqlCommand cmd = new SqlCommand("USP_USERS_PERMISOS_MOSTRAR", cn.getCn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter paramUserLogin = cmd.Parameters.Add("@USER_LOGIN", SqlDbType.NChar, 50);
            paramUserLogin.Value = prmUserLogin;
            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                if (Convert.ToBoolean(dr["ADMINISTRADOR"]))
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{administrador}", "<a href='PanelAdministrador.aspx' class='pro-link' title='Maneja las operaciones creados en FacilitoOnline'>Administrador : </a>");
                }
                else
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{administrador}", "");
                }
                if (Convert.ToBoolean(dr["VISITANTE"]))
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{visitante}", "<a href='PanelVisitante.aspx' title='Cambia tu avatar, tu nombre, tu perfil ...'>Visitante :</a>");
                }
                else
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{visitante}", "");
                }
                if (Convert.ToBoolean(dr["CLIENTESOCIO"]))
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{clienteSocio}", "<a href='PanelSocio.aspx' title='Sube tus servicios y publicidades'>Cliente Socio :</a>");
                }
                else
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{clienteSocio}", "");
                }
                if (Convert.ToBoolean(dr["CLIENTEINVITADO"]))
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{clienteInvitado}", "<a href='PanelInvitado.aspx' title='Haz que todos conoscan tu negocio'>Cliente Invitado</a>");
                }
                else
                {
                    lblOpciones.Text = lblOpciones.Text.Replace("{clienteInvitado}", "");
                }

                lblOpciones.Visible = true;
            }

            dr.Close();
            cmd.Dispose();
            cn.getCn.Close();
            cn.getCn.Dispose();
        }
        catch (Exception ex)
        {
            lblOpciones.Text = ex.Message;
        }
    }
}
