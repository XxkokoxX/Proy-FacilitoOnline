using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class Pais
{
    Conexion cn = new Conexion();

	public Pais()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarPaises()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_pais",cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarEstados()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from tb_estado", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarDistritos()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from distritos", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarProvincias()
    {
        SqlDataAdapter da = new SqlDataAdapter("select * from provincias", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }
    public DataTable listarEstadoxPais(string pais)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct id, estado from tb_estado where pais=@pais", cn.getCn);
        da.SelectCommand.Parameters.Add("@pais",SqlDbType.Char).Value = pais;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarDistritosxDepartamentos(string dept)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct * from distritos d join provincias p " + 
        "on d.provincia = p.idprovincia where departamento = @dept", cn.getCn);
        da.SelectCommand.Parameters.Add("@dept", SqlDbType.Char).Value = dept;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

    public DataTable listarProvinciasxDistritos(string dist)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct * from tb_estado e join provincias p " +
        "on e.id = p.departamento where e.id=@dist", cn.getCn);
        da.SelectCommand.Parameters.Add("@dist", SqlDbType.Char).Value = dist;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

}

