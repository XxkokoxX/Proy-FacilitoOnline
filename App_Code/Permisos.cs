using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Data.SqlClient;
using System.Data;

public class Permisos
{
    Conexion cn = new Conexion();

	public Permisos()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public String registrarPermisoClienteYUsuarios(DataPermiso p)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_PERMISOS_CLIENTE_Y_USUARIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@CLIENTE_O_USUARIO", SqlDbType.VarChar).Value = p.Cliente_O_Usuario;
        /*cmd.Parameters.Add("@ACTIVO", SqlDbType.Bit).Value = p.Activo;
        cmd.Parameters.Add("@ADMINISTRADOR", SqlDbType.Bit).Value = p.Administrador;
        cmd.Parameters.Add("@VISITANTE", SqlDbType.Bit).Value = p.Visitante;
        cmd.Parameters.Add("@CLIENTESOCIO", SqlDbType.Bit).Value = p.ClienteSocio;
        cmd.Parameters.Add("@CLIENTEINVITADO", SqlDbType.Bit).Value = p.ClienteInvitado;*/

        cn.getCn.Open();

        try
        {
            cmd.ExecuteNonQuery();
            msg = "Muchas Gracias! Su Cuenta ha sido Activada. Usted ya puede ingresar a la aplicación";
        }
        catch (Exception ex)
        {
            msg = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return msg;
    }

    public DataTable listarPermisosUsuariosYClientes()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_permiso_usuario union select * from tb_permiso_cliente", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarsUsuariosYClientesSinPermiso()
    {
        SqlDataAdapter da = new SqlDataAdapter("USP_LISTA_CLIENTES_Y_USUARIOS_SIN_PERMISOS", cn.getCn);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registrarYmodificarPermisoClienteYUsuarios(DataPermiso p)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRA_Y_ACTUALIZA_PERMISOS_CLIENTE_Y_USUARIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@CLIENTE_O_USUARIO", SqlDbType.VarChar).Value = p.Cliente_O_Usuario;
        cmd.Parameters.Add("@ACTIVO", SqlDbType.Bit).Value = p.Activo;
        cmd.Parameters.Add("@ADMINISTRADOR", SqlDbType.Bit).Value = p.Administrador;
        cmd.Parameters.Add("@VISITANTE", SqlDbType.Bit).Value = p.Visitante;
        cmd.Parameters.Add("@CLIENTESOCIO", SqlDbType.Bit).Value = p.ClienteSocio;
        cmd.Parameters.Add("@CLIENTEINVITADO", SqlDbType.Bit).Value = p.ClienteInvitado;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " registro actualizado";
        }
        catch (Exception ex)
        {
            msg = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return msg;
    }
}