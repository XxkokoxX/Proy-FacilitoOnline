using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class SubComentario
{
    Conexion cn = new Conexion();

	public SubComentario()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarSubComentarios()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_post p join tb_comentario c on p.comentario = c.id where c.id = 1", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registrarSubComentario(DataSubComentario dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("usp_registrar_subcomentario", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@subcomentario", SqlDbType.VarChar).Value = dc.SubComentario;
        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = dc.Usuario;
        cmd.Parameters.Add("@comentario", SqlDbType.Int).Value = dc.Comentario;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " SubComentario registrado";
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

    public String eliminarSubComentario(DataSubComentario dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("usp_eliminar_subcomentario", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.VarChar).Value = dc.Id;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " SubComentario eliminado";
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