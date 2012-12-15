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

    public DataTable listarEstadoxPais(string pais)
    {
        SqlDataAdapter da = new SqlDataAdapter("select distinct id, estado from tb_estado where pais=@pais", cn.getCn);
        da.SelectCommand.Parameters.Add("@pais",SqlDbType.Char).Value = pais;
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }

}

