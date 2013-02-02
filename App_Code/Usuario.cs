using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Data.SqlClient;
using System.Data;

public class Usuario
{
    Conexion cn = new Conexion();

	public Usuario()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarTiposDeUsuarios()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_tipo_usuario", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarTipoUsuario()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_tipo_usuario where id_tipo_usuario = 2", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registrarUsuario(DataUsuario du)
    {
        string msg = "";

        SqlCommand cmd = new SqlCommand("USP_REGISTRAR_USUARIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@EMAIL", SqlDbType.VarChar).Value = du.Email;
        cmd.Parameters.Add("@CLAVE", SqlDbType.Char).Value = du.Clave;
        cmd.Parameters.Add("@NOMBRES", SqlDbType.VarChar).Value = du.Nombres;
        cmd.Parameters.Add("@APELLIDOS", SqlDbType.VarChar).Value = du.Apellidos;
        cmd.Parameters.Add("@DIRECCION", SqlDbType.VarChar).Value = du.Direccion;
        cmd.Parameters.Add("@FECHA_NACIMIENTO", SqlDbType.DateTime).Value = du.FechaDeNacimiento;
        cmd.Parameters.Add("@TIPO_USUARIO", SqlDbType.Int).Value = du.TipoDeUsuario;

        cn.getCn.Open();

        try
        {
            msg = cmd.ExecuteNonQuery() + " usuario registrado";
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


    public DataTable listarUsuario()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_usuario", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable buscarUsuario(string email)
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_usuario where email = @email", cn.getCn);
        da.SelectCommand.Parameters.Add("@email",SqlDbType.VarChar).Value = email;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public String registraYmodificaUsuario(DataUsuario du)
    {
        string msg = "";
        SqlCommand cmd = new SqlCommand("USP_REGISTRA_ACTUALIZA_USUARIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@EMAIL", SqlDbType.VarChar).Value = du.Email;
        cmd.Parameters.Add("@CLAVE", SqlDbType.Char).Value = du.Clave;
        cmd.Parameters.Add("@NOMBRES", SqlDbType.VarChar).Value = du.Nombres;
        cmd.Parameters.Add("@APELLIDOS", SqlDbType.VarChar).Value = du.Apellidos;
        cmd.Parameters.Add("@DIRECCION", SqlDbType.VarChar).Value = du.Direccion;
        cmd.Parameters.Add("@FECHA_NACIMIENTO", SqlDbType.DateTime).Value = du.FechaDeNacimiento;
        cmd.Parameters.Add("@TIPO_USUARIO", SqlDbType.Int).Value = du.TipoDeUsuario;

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

    public String eliminarUsuario(DataUsuario du)
    {
        String msg = "";

        SqlCommand cmd = new SqlCommand("USP_ELIMINAR_USUARIO", cn.getCn);
        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.Add("@EMAIL", SqlDbType.VarChar).Value = du.Email;

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


    public DataTable listarUsuarioVisitante()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_usuario where tipoUsuario = 2", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }
}