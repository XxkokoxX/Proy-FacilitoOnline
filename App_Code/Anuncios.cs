using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Drawing;

public class Anuncios
{

    Conexion cn = new Conexion();

	public Anuncios()
	{
        //
        // TODO: Agregar aquí la lógica del constructor
        //
	}

    public String Borrar(string titulo) 
    {
        string m = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_ANUNCIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@titulo", SqlDbType.VarChar).Value = titulo;

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

    public DataTable listarAnuncios()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_anuncios", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarAnuncioxTitulo(string titulo)
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_anuncios where titulo = '"+titulo+"' ", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String Insertar(string titulo,string descripcion, byte[] imagen,string ruc, string menbresia)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_ANUNCIOS", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@titulo", SqlDbType.VarChar).Value = titulo;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
        cmd.Parameters.Add("@imagen", SqlDbType.Image).Value = imagen;
        cmd.Parameters.Add("@ruc", SqlDbType.VarChar).Value = ruc;
        cmd.Parameters.Add("@membresia", SqlDbType.VarChar).Value = menbresia;
        cn.getCn.Open();

        try
        {
            cmd.ExecuteNonQuery();
            msg =  " Su Anuncio se registro satisfactoriamente";
        }
        catch (Exception ex)
        {
            msg = ex.Message;
        }
        finally
        {
            cn.getCn.Close();
        }

        return msg ;
    }

    public String Modificar(int cod, string titulo, string descripcion, byte[] imagen,int chk)
    {
        string msg = "";
        
        SqlCommand cmd = new SqlCommand("USP_MODIFICAR_ANUNCIOM", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@cod",SqlDbType.Int).Value = cod;
        cmd.Parameters.Add("@titulo", SqlDbType.VarChar).Value = titulo;
        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
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

}