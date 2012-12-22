using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.Data.SqlClient;
/// <summary>
/// Descripción breve de Reserva
/// </summary>
public class Reserva
{

    Conexion cn = new Conexion();
	public Reserva()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}
  
    public String RegistrarReserva(string ruc,string local, string fecha_res, int hora, int cantidad,string usuario,string fecha_reg)
    {
        string msg = "na :S";

        SqlCommand cmd = new SqlCommand("USP_INGRESARRESERVA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@ruc", SqlDbType.VarChar).Value = ruc;
        cmd.Parameters.Add("@municipio", SqlDbType.VarChar).Value = local;
        cmd.Parameters.Add("@fecha_res", SqlDbType.Date).Value = fecha_res;
        cmd.Parameters.Add("@hora", SqlDbType.Int).Value = hora ;
        cmd.Parameters.Add("@cantidad", SqlDbType.Int).Value = cantidad;
        cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = usuario;
        cmd.Parameters.Add("@fecha_reg", SqlDbType.Date).Value = fecha_reg;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " Reserva Realizada. Se enviara un correo eléctronico como constancia ";
        }
        catch (Exception ex)
        {
            msg = ex.Message + "exceptino";
        }
        finally
        {
            cn.getCn.Close();
        }

        return msg;
    }

    public DataTable ListarReserva(string nombre)
    {

        SqlDataAdapter da = new SqlDataAdapter("select * from tb_reservas where usuario='"+nombre+"'", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String eliminarReserva(int id)
    {
        String msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINA_RESERVA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " registro eliminado";
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

    public String ModificarReserva(string cod,string hora, string cantidad)
    {
        string m = "";

        int id = int.Parse(cod);
        int cant = int.Parse(cantidad);
        int h = int.Parse(hora);

        SqlCommand cmd = new SqlCommand("USP_MODIFICAR_RESERVA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
        cmd.Parameters.Add("@cantidad", SqlDbType.Int).Value = cant;
        cmd.Parameters.Add("@hora", SqlDbType.Int).Value = h;

        cn.getCn.Open();
        try
        {
            m = cmd.ExecuteNonQuery().ToString() + " cambio realizado";
        }
        catch (Exception ex)
        {
            m = ex.Message+cod + cant;
        }
        finally
        {
            cn.getCn.Close();
        }

        return m;
    }

    public String RecuperarEmail(string nombre)
    {

        SqlDataAdapter da = new SqlDataAdapter("select emailContacto from tb_cliente where membresia ='"+nombre+"'", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);


        return tb.Rows[0][0].ToString();
    }

}