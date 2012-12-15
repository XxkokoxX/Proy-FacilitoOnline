using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;

public class Conexion
{
    private SqlConnection cn;

    public Conexion()
    {
        cn = new SqlConnection("Server=XxkokoxX-VAIO\\SQLEXPRESS; Database=FACILITOONLINE; uid=i7exe; pwd=sql");
    }

    public SqlConnection getCn
    {
        get
        {
            return cn;
        }
    }
}