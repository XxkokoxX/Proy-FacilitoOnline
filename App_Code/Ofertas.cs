using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class Ofertas
{
    Conexion cn = new Conexion();

	public Ofertas()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarOfertass()
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("select * from tb_ofertas o join tb_cliente c on o.cliente = c.membresia", cn.getCn);
        sda.Fill(dt);
        return dt;

    }

    public DataTable listarOfertas(string cli)
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("select * from tb_ofertas where estado = 1 and cliente=@cli", cn.getCn);
        sda.SelectCommand.Parameters.Add("@cli",SqlDbType.VarChar).Value = cli;
        sda.Fill(dt);
        return dt;
    }

    public String registraOfertas(DataOfertas doo)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_OFERTA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@oferta", SqlDbType.VarChar).Value = doo.Oferta;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = doo.Descripcion;
        cmd.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = doo.Fecha_inicio;
        cmd.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = doo.Fecha_fin;
        cmd.Parameters.Add("@cliente", SqlDbType.VarChar).Value = doo.Cliente;
        cmd.Parameters.Add("@producto", SqlDbType.Int).Value = doo.Producto;
        cmd.Parameters.Add("@precioactual", SqlDbType.Float).Value = doo.PrecioActual;
        cmd.Parameters.Add("@preciooferta", SqlDbType.Float).Value = doo.PrecioOferta;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Oferta registrada";
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

    public String modificarOfertas(DataOfertas doo)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_OFERTA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = doo.Id;
        cmd.Parameters.Add("@oferta", SqlDbType.VarChar).Value = doo.Oferta;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = doo.Descripcion;
        cmd.Parameters.Add("@fecha_inicio", SqlDbType.DateTime).Value = doo.Fecha_inicio;
        cmd.Parameters.Add("@fecha_fin", SqlDbType.DateTime).Value = doo.Fecha_fin;
        cmd.Parameters.Add("@producto", SqlDbType.Int).Value = doo.Producto;
        cmd.Parameters.Add("@precioactual", SqlDbType.Float).Value = doo.PrecioActual;
        cmd.Parameters.Add("@preciooferta", SqlDbType.Float).Value = doo.PrecioOferta;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Oferta actualizada";
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

    public String eliminaOferta(DataOfertas doo)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_OFERTA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = doo.Id;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Oferta eliminada";
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


    public DataTable listarOfertasxClient(string cli)
    {
        DataTable dt = new DataTable();
        SqlDataAdapter sda = new SqlDataAdapter("select o.*,c.razonSocial from tb_ofertas o join tb_cliente c on o.cliente = c.membresia where o.cliente = @cli", cn.getCn);
        sda.SelectCommand.Parameters.Add("@cli", SqlDbType.VarChar).Value = cli;
        sda.Fill(dt);
        return dt;
    }
}