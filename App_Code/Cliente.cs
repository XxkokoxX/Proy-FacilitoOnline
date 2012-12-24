using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Data.SqlClient;
using System.Data;

public class Cliente
{
    Conexion cn = new Conexion();

	public Cliente()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarCargos()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_cargo", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarTipoCliente()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_tipo_cliente", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registrarCliente(DataCliente cli)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_CLIENTE", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@MEMBRESIA",SqlDbType.VarChar).Value = cli.Membresia;
        cmd.Parameters.Add("@CLAVE", SqlDbType.VarChar).Value = cli.Clave;
        cmd.Parameters.Add("@CONTACTO",SqlDbType.VarChar).Value = cli.Contacto;
        cmd.Parameters.Add("@EMAIL",SqlDbType.VarChar).Value = cli.Email;
        cmd.Parameters.Add("@CARGO",SqlDbType.Int).Value = cli.Cargo;
        cmd.Parameters.Add("@RAZON_SOCIAL",SqlDbType.VarChar).Value = cli.RazonSocial;
        cmd.Parameters.Add("@CALLE",SqlDbType.VarChar).Value = cli.Calle;
        cmd.Parameters.Add("@NUMERO_EXTERIOR",SqlDbType.Char).Value = cli.NumeroExterior;
        cmd.Parameters.Add("@NUMERO_INTERIOR",SqlDbType.Char).Value = cli.NumeroInterior;
        cmd.Parameters.Add("@MUNICIPIO",SqlDbType.VarChar).Value = cli.Municipio;
        cmd.Parameters.Add("@CODIGO_POSTAL",SqlDbType.Char).Value = cli.CodigoPostal;
        cmd.Parameters.Add("@CIUDAD",SqlDbType.VarChar).Value = cli.Ciudad;
        cmd.Parameters.Add("@PAIS",SqlDbType.Char).Value = cli.Pais;
        cmd.Parameters.Add("@ESTADO",SqlDbType.Int).Value = cli.Estado;
        cmd.Parameters.Add("@SITIO_WEB",SqlDbType.VarChar).Value = cli.SitioWeb;
        cmd.Parameters.Add("@ACTIVIDAD_PREPONDERANTE",SqlDbType.VarChar).Value = cli.ActividadPreponderante;
        cmd.Parameters.Add("@LISTADO_PRODUCTOS",SqlDbType.VarChar).Value = cli.ListadoProductos;
        cmd.Parameters.Add("@TIPO_CLIENTE",SqlDbType.Int).Value = cli.TipoCliente;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " cliente registrado";
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


    public String modficiarCuentaYPerfilDelCliente(DataCliente cli)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_MODIFICAR_CUENTA_CLIENTE", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@MEMBRESIA", SqlDbType.VarChar).Value = cli.Membresia;
        cmd.Parameters.Add("@CUENTA", SqlDbType.Int).Value = cli.TipoCliente;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " Registro actualizado";
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


    public DataTable listarCliente()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_cliente", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable buscarCliente(string membresia)
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_cliente where membresia=@mem", cn.getCn);
        da.SelectCommand.Parameters.Add("@mem", SqlDbType.VarChar).Value = membresia;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registraYmodificaCliente(DataCliente dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRA_ACTUALIZA_CLIENTE", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@MEMBRESIA", SqlDbType.VarChar).Value = dc.Membresia;
        cmd.Parameters.Add("@CLAVE", SqlDbType.VarChar).Value = dc.Clave;
        cmd.Parameters.Add("@CONTACTO", SqlDbType.VarChar).Value = dc.Contacto;
        cmd.Parameters.Add("@EMAIL", SqlDbType.VarChar).Value = dc.Email;
        cmd.Parameters.Add("@CARGO", SqlDbType.Int).Value = dc.Cargo;
        cmd.Parameters.Add("@RAZON_SOCIAL", SqlDbType.VarChar).Value = dc.RazonSocial;
        cmd.Parameters.Add("@CALLE", SqlDbType.VarChar).Value = dc.Calle;
        cmd.Parameters.Add("@NUMERO_EXTERIOR", SqlDbType.Char).Value = dc.NumeroExterior;
        cmd.Parameters.Add("@NUMERO_INTERIOR", SqlDbType.Char).Value = dc.NumeroInterior;
        cmd.Parameters.Add("@MUNICIPIO", SqlDbType.VarChar).Value = dc.Municipio;
        cmd.Parameters.Add("@CODIGO_POSTAL", SqlDbType.Char).Value = dc.CodigoPostal;
        cmd.Parameters.Add("@CIUDAD", SqlDbType.VarChar).Value = dc.Ciudad;
        cmd.Parameters.Add("@PAIS", SqlDbType.Char).Value = dc.Pais;
        cmd.Parameters.Add("@ESTADO", SqlDbType.Int).Value = dc.Estado;
        cmd.Parameters.Add("@SITIO_WEB", SqlDbType.VarChar).Value = dc.SitioWeb;
        cmd.Parameters.Add("@ACTIVIDAD_PREPONDERANTE", SqlDbType.VarChar).Value = dc.ActividadPreponderante;
        cmd.Parameters.Add("@LISTADO_PRODUCTOS", SqlDbType.VarChar).Value = dc.ListadoProductos;
        cmd.Parameters.Add("@TIPO_CLIENTE", SqlDbType.Int).Value = dc.TipoCliente;

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

    public String eliminarCliente(DataCliente dc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINA_CLIENTES", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@MEMBRESIA", SqlDbType.VarChar).Value = dc.Membresia;

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


    public DataTable buscarClientePorRazonSocial(string razonSocial)
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_cliente where razonSocial=@razon", cn.getCn);
        da.SelectCommand.Parameters.Add("@razon",SqlDbType.VarChar).Value = razonSocial;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable obtenerDireccionCliente(string razonSocial)
    {
        SqlDataAdapter da = new SqlDataAdapter("select calle,municipio,estado,pais from tb_cliente where razonSocial=@razon", cn.getCn);
        da.SelectCommand.Parameters.Add("@razon", SqlDbType.VarChar).Value = razonSocial;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }


    public DataTable filtro1(string razon)
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_cliente where razonSocial like '" + razon + "%'", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }
}