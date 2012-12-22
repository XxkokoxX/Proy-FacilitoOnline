<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using System.Data;
using System.Data.SqlClient;

public class Handler : IHttpHandler {


    Conexion cn = new Conexion();
    
    public void ProcessRequest (HttpContext context) 
    {
        string t = context.Request.QueryString["titulo"];

        context.Response.ContentType = "image/jpeg";

        SqlDataAdapter da = new SqlDataAdapter("select * from tb_anuncios where titulo = '" + t + "'", cn.getCn);

        DataTable tb = new DataTable();
        da.Fill(tb);

        byte[] b = (byte[])tb.Rows[0][3];
        context.Response.BinaryWrite(b);
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }

}