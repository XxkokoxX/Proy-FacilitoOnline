<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Data;
using System.Data.SqlClient;

public class Handler : IHttpHandler {

    Conexion cn = new Conexion();
    public void ProcessRequest (HttpContext context) {

        string id = context.Request.QueryString["id"];
        context.Response.ContentType = "image/jpeg";

        SqlDataAdapter da = new SqlDataAdapter("select * from tb_productos where id = '" + id + "'", cn.getCn);


        DataTable tb = new DataTable();
        da.Fill(tb);


        byte[] b = (byte[])tb.Rows[0][5];
        context.Response.BinaryWrite(b);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}