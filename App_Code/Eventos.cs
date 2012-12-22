using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class Eventos
{
    Conexion cn = new Conexion();

	public Eventos()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarEventos()
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("select * from tb_eventos where estado = 1", cn.getCn);
        sda.Fill(dt);
        return dt;
    }

    public String registrEventos(DataEventos de)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_EVENTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@evento", SqlDbType.VarChar).Value = de.Evento;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = de.Descripcion;
        cmd.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = de.Fecha_inicio;
        cmd.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = de.Fecha_fin;
        cmd.Parameters.Add("@cliente", SqlDbType.VarChar).Value = de.Cliente;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Evento registrado";
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

    public String modificarEventos(DataEventos de)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_EVENTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = de.Id;
        cmd.Parameters.Add("@evento", SqlDbType.VarChar).Value = de.Evento;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = de.Descripcion;
        cmd.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = de.Fecha_inicio;
        cmd.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = de.Fecha_fin;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Evento actualizado";
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

    public String eliminaEventos(DataEventos de)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_EVENTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = de.Id;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Evento eliminado";
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