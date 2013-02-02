using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;
using System.Data;

public class CorreoAutomatico
{
    Conexion cn = new Conexion();

	public CorreoAutomatico()
	{
		//
		// TODO: Agregar aquí la lógica del constructor
		//
	}

    public DataTable listarCorreosDeSocios()
    {
        SqlDataAdapter da = new SqlDataAdapter("select c.nombreContacto,c.emailContacto from tb_cliente c join tb_permiso_cliente pc on c.membresia = pc.cliente where c.tipocliente = 2 ", cn.getCn);
        DataTable tb = new DataTable();
        da.Fill(tb);
        return tb;
    }
}