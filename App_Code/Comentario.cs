using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class Comentario
{
    Conexion cn = new Conexion();

	public Comentario()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarComentarios1()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_comentario", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarComentarios()
    {
        SqlDataAdapter da = new SqlDataAdapter("select u.nombres + ' '+ apellidos as nombreCompleto,u.email " +
            "from tb_usuario u where u.email in (select usuario from tb_comentario)", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarComentariosxUsuario(string usuario)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct u.nombres + ' ' + apellidos as nombreCompleto,c.usuario, " +
            "c.fecha,c.comentario from tb_comentario c join tb_usuario u " +
            "on c.usuario = u.email where c.usuario=@usuario", cn.getCn);
        da.SelectCommand.Parameters.Add("@usuario",SqlDbType.VarChar).Value = usuario;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarComentariosxRangoDeFechas(DateTime f1, DateTime f2)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct * from tb_comentario where fecha between @f1 and @f2", cn.getCn);
        da.SelectCommand.Parameters.Add("@f1", SqlDbType.DateTime).Value = f1;
        da.SelectCommand.Parameters.Add("@f2", SqlDbType.DateTime).Value = f2;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registrarComentario(DataComentario dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("usp_registrar_comentario", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@comentario", SqlDbType.VarChar).Value = dc.Comentario;
        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = dc.Usuario;
        cmd.Parameters.Add("@cliente", SqlDbType.VarChar).Value = dc.Cliente;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " Comentario registrado";
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

    public String eliminarComentario(DataComentario dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("usp_eliminar_comentario", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.VarChar).Value = dc.Id;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " Comentario eliminado";
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