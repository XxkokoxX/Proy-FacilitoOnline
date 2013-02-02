using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

public class Cotizacion
{
    Conexion cn = new Conexion();

	public Cotizacion()
	{
	}

    public DataTable listarCotizacionesCliente(string cliente) {
        SqlDataAdapter sql = new SqlDataAdapter("select a.id,b.email, b.apellidos, b.nombres, b.direccion, a.nro_personas, a.mot_usuario, a.fecha_solicitud " +
                                                "from tb_cotizacion a, tb_usuario b " +
                                                "where a.usuario = b.email " +
                                                "and a.cliente=@cli and a.resp_cliente is null", cn.getCn);

        sql.SelectCommand.Parameters.Add("@cli", SqlDbType.VarChar).Value = cliente;

        DataTable dt = new DataTable();
        sql.Fill(dt);

        return dt;
    }

    public DataTable listarCliente()
    {
        SqlDataAdapter da = new SqlDataAdapter("select a.* from tb_cliente a, tb_permiso_cliente b " +
                                                " where a.membresia = b.cliente " +
                                                " and b.clienteSocio = 1 " +
                                                " and b.activo = 1", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }


    public void registrarCotizacion(string usuario, string cliente, int nroPersonas, string motivo, DateTime fecha) {
        SqlCommand cmd = cn.getCn.CreateCommand();
        cmd.CommandText = "usp_registraCotizacion";
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@solicitante", SqlDbType.VarChar).Value = usuario;
        cmd.Parameters.Add("@cliente", SqlDbType.VarChar).Value = cliente;
        cmd.Parameters.Add("@nro_personas", SqlDbType.Int).Value = nroPersonas;
        cmd.Parameters.Add("@mot_usuario", SqlDbType.VarChar).Value = motivo;
        cmd.Parameters.Add("@fecha_solicitud", SqlDbType.DateTime).Value = fecha;

        cn.getCn.Open();
        try
        {
            cmd.ExecuteNonQuery();
        }
        catch (Exception e)
        {
        }
        finally {
            cn.getCn.Close();
        }
    }

    public void responderCotizacion(int id, string respuesta)
    {
        SqlCommand cmd = new SqlCommand("usp_responder_cotizacion", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
        cmd.Parameters.Add("@respuesta", SqlDbType.VarChar).Value = respuesta;

        cn.getCn.Open();
        try
        {
            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
        }
        finally
        {
            cn.getCn.Close();
        }
    }

    public DataTable listarCotizacionesRecibidas(string nombre)
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("usp_listar_cotizaciones_recibidas", cn.getCn);
        sda.SelectCommand.CommandType = CommandType.StoredProcedure;
        sda.SelectCommand.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;

        sda.Fill(dt);
        return dt;
    }
}
