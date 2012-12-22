using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Data.SqlClient;
using System.Data;

public class Sucursales
{
    Conexion cn = new Conexion();

	public Sucursales()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarSucursales()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_sucursal", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registraSucursales(DataSucursal ds)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_SUCURSAL", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@Sucur", SqlDbType.VarChar).Value = ds.Sucursal;
        cmd.Parameters.Add("@descSucur", SqlDbType.VarChar).Value = ds.Descripcion;
        cmd.Parameters.Add("@telefono", SqlDbType.VarChar).Value = ds.Telefono;
        cmd.Parameters.Add("@idDist", SqlDbType.Char).Value = ds.Distrito;
        cmd.Parameters.Add("@direccion", SqlDbType.VarChar).Value = ds.Direccion;
        cmd.Parameters.Add("@cliente", SqlDbType.VarChar).Value = ds.Cliente;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Sucursal registrado";
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

    public String modificarSucursales(DataSucursal ds)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ACTUALIZAR_SUCURSAL", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = ds.Id;
        cmd.Parameters.Add("@Sucur", SqlDbType.VarChar).Value = ds.Sucursal;
        cmd.Parameters.Add("@descSucur", SqlDbType.VarChar).Value = ds.Descripcion;
        cmd.Parameters.Add("@telefono", SqlDbType.VarChar).Value = ds.Telefono;
        cmd.Parameters.Add("@idDist", SqlDbType.Char).Value = ds.Distrito;
        cmd.Parameters.Add("@direccion", SqlDbType.VarChar).Value = ds.Direccion;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Sucursal actualizado";
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

    public String eliminaSucursales(DataSucursal ds)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_SUCURSAL", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = ds.Id;

        cn.getCn.Open();
        try
        {
            msg = cmd.ExecuteNonQuery().ToString() + " Sucursal eliminado";
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