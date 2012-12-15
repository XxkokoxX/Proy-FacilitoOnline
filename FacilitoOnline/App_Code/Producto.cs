using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data;
using System.Data.SqlClient;

public class Producto
{
    Conexion cn = new Conexion();

	public Producto()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public String BorrarCategoria(string cod)
    {
        int id = int.Parse(cod);
        string m = "";

        try
        {
            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = new SqlCommand("delete tb_categoria_prod where id=" + id + "", cn.getCn);
            cn.getCn.Open();
            m = da.SelectCommand.ExecuteNonQuery().ToString() + " registro eliminado";
        }
        catch (Exception ex)
        {
            m = "No puede borrar esta Categoria por que esta siendo usada por un Producto, por favor elimine el producto";
        }
        finally { cn.getCn.Close(); }

        return m;
    }

    public String agregarCategoria(string categoria) {

        string m = "";

        SqlCommand cmd = new SqlCommand("USP_AGREGAR_CATEGORIA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@categoria", SqlDbType.VarChar).Value = categoria;

        cn.getCn.Open();
        try
        {
            cmd.ExecuteNonQuery();
            m =  " Categoría Agregada";
        }
        catch (Exception ex)
        {
            m = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return m;
    }

    public String ModificarCtegoria(string cod,string nombre)
    {
        string m = "";

        int id = int.Parse(cod);

        SqlCommand cmd = new SqlCommand("USP_MODIFICAR_CATEGORIA", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = nombre;

        cn.getCn.Open();
        try
        {
            m = cmd.ExecuteNonQuery().ToString() + " cambio realizado";
        }
        catch (Exception ex)
        {
            m = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return m;
    }


    public DataTable cargarCategoria()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_categoria_prod", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable UbicarProducto(string nombre)
    {
        SqlDataAdapter da = new SqlDataAdapter();
        da.SelectCommand = new SqlCommand("USP_UBICARPRODUCTO", cn.getCn);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;

        da.SelectCommand.Parameters.Add("@nom", SqlDbType.VarChar).Value = nombre;

        DataTable tb = new DataTable();
        da.Fill(tb);
        
        return tb;
    }

    public DataTable listarProductos(string ruc)
    {
        SqlDataAdapter da = new SqlDataAdapter();
        da.SelectCommand = new SqlCommand("USP_LISTAR_PROD_CATEGO_xRuc", cn.getCn);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;

        da.SelectCommand.Parameters.Add("@ruc", SqlDbType.VarChar).Value = ruc;

        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String InsertarProducto(string nombre, int categoria, int cantidad, decimal precio, byte[] imagen, string ruc)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_INSERTAR_PRODUCTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;
        cmd.Parameters.Add("@categoria", SqlDbType.Int).Value = categoria;
        cmd.Parameters.Add("@cantidad", SqlDbType.Int).Value = cantidad;
        cmd.Parameters.Add("@precio", SqlDbType.Decimal).Value = precio;
        cmd.Parameters.Add("@imagen", SqlDbType.Image).Value = imagen;
        cmd.Parameters.Add("@ruc", SqlDbType.VarChar).Value = ruc;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " Producto Agregado";
        }
        catch (Exception ex)
        {
            msg = ex.Message + categoria;
        }
        finally
        {
            cn.getCn.Close();
        }

        return msg;
    }

    public String Modificar(int cod, string nombre, int categoria, int cantidad, decimal precio, byte[] imagen, int chk)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_MODIFICAR_PRODUCTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@cod", SqlDbType.Int).Value = cod;
        cmd.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;
        cmd.Parameters.Add("@categoria", SqlDbType.Int).Value = categoria;
        cmd.Parameters.Add("@cantidad", SqlDbType.Int).Value = cantidad;
        cmd.Parameters.Add("@precio", SqlDbType.Decimal).Value = precio;
        cmd.Parameters.Add("@imagen", SqlDbType.Image).Value = imagen;
        cmd.Parameters.Add("@var", SqlDbType.Int).Value = chk;

        cn.getCn.Open();

        try
        {
            cmd.ExecuteNonQuery();
            msg = "Cambios realizados correctamente";
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

    public String BorrarProducto(string nombre)
    {
        string m = "na";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_PRODUCTO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@nom", SqlDbType.VarChar).Value = nombre;

        cn.getCn.Open();
        try
        {
            m = cmd.ExecuteNonQuery().ToString() + " registro eliminado";
        }
        catch (Exception ex)
        {
            m = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return m;
    }
}